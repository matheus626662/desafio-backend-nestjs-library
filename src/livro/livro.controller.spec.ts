// src/livro/livro.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LivroController } from './livro.controller';
import { LivroService } from './livro.service';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { Livro } from '../entities/livro.entity';
import { Autor } from '../entities/autor.entity';
import { NotFoundException } from '@nestjs/common'; //

const mockMinimalAutor: Autor = {
  id: 'autor-uuid',
  nome: 'Autor Mock',
  dataNascimento: new Date('1900-01-01'),
  nacionalidade: 'Mockland',
  livros: [],
};

const mockLivroService = {
  create: jest.fn((dto) => {
    return {
      id: 'some-uuid-livro',
      ...dto,

      descricao: dto.descricao || '',
      autor: { ...mockMinimalAutor, id: dto.autorId },
    };
  }),
  findAll: jest.fn(() => []),
  findOne: jest.fn((id: string) => {
    if (id === 'existing-livro-id') {
      return {
        id: 'existing-livro-id',
        titulo: 'Livro Mock',
        descricao: 'Uma descrição mock.',
        anoPublicacao: 2000,
        autor: mockMinimalAutor,
      } as Livro;
    }
    return null;
  }),
  update: jest.fn((id, dto) => {
    if (id === 'existing-livro-id') {
      return {
        id: 'existing-livro-id',

        titulo: dto.titulo || 'Livro Mock',
        descricao: dto.descricao || 'Uma descrição mock.',
        anoPublicacao: dto.anoPublicacao || 2000,
        autor: dto.autorId
          ? { ...mockMinimalAutor, id: dto.autorId }
          : mockMinimalAutor,
      };
    }
    return null;
  }),
  remove: jest.fn((id) => {
    if (id === 'existing-livro-id') return undefined;
    throw new NotFoundException('Livro não encontrado');
  }),
};

describe('LivroController', () => {
  let controller: LivroController;
  let service: LivroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LivroController],
      providers: [
        {
          provide: LivroService,
          useValue: mockLivroService,
        },
      ],
    }).compile();

    controller = module.get<LivroController>(LivroController);
    service = module.get<LivroService>(LivroService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const createDto: CreateLivroDto = {
        titulo: 'Novo Livro',
        descricao: 'Descrição do novo livro.',
        anoPublicacao: 2023,
        autorId: 'valid-autor-id',
      };
      const expectedResult = {
        id: 'new-id',
        ...createDto,
        autor: { ...mockMinimalAutor, id: 'valid-autor-id' },
      } as Livro;
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return an array of books', async () => {
      const expectedResult = [
        {
          id: '1',
          titulo: 'Livro 1',
          descricao: 'Descricao 1',
          anoPublicacao: 2000,
          autor: { ...mockMinimalAutor, id: 'a', nome: 'Autor A' },
        },
      ] as Livro[];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return a book', async () => {
      const bookId = 'existing-livro-id';
      const expectedResult = {
        id: bookId,
        titulo: 'Livro Teste',
        descricao: 'Descrição do livro teste.',
        anoPublicacao: 2000,
        autor: mockMinimalAutor,
      } as Livro;
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(bookId);
      expect(service.findOne).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should call service.update and return the updated book', async () => {
      const bookId = 'existing-livro-id';
      const updateDto: UpdateLivroDto = { titulo: 'Livro Atualizado' };
      const expectedResult = {
        id: bookId,
        titulo: 'Livro Atualizado',
        descricao: 'Uma descrição mock.',
        anoPublicacao: 2000,
        autor: mockMinimalAutor,
      } as Livro;

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      const result = await controller.update(bookId, updateDto);
      expect(service.update).toHaveBeenCalledWith(bookId, updateDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if book to update is not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());
      await expect(controller.update('non-existent-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      const bookId = 'existing-livro-id';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(bookId);
      expect(service.remove).toHaveBeenCalledWith(bookId);
    });

    it('should throw NotFoundException if book to remove is not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
      await expect(controller.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
