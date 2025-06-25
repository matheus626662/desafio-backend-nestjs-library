// src/livro/livro.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LivroService } from './livro.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Livro } from '../entities/livro.entity';
import { Repository } from 'typeorm';
import { AutorService } from '../autor/autor.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Autor } from '../entities/autor.entity';

const mockLivroRepository = () => ({
  create: jest.fn((dto) => dto),
  save: jest.fn((livro) => Promise.resolve({ id: 'livro-uuid', ...livro })),
  find: jest.fn(() => Promise.resolve([])),
  findOne: jest.fn((query) => {
    if (query.where.id === 'existing-livro-id') {
      return Promise.resolve({
        id: 'existing-livro-id',
        titulo: 'Livro Teste',
        anoPublicacao: 2000,
        autor: { id: 'autor-uuid', nome: 'Autor Teste' },
      } as Livro);
    }
    return Promise.resolve(null);
  }),
  delete: jest.fn((id) =>
    Promise.resolve({ affected: id === 'existing-livro-id' ? 1 : 0 }),
  ),
});

const mockAutorService = () => ({
  findOne: jest.fn((id: string) => {
    if (id === 'valid-autor-id') {
      return Promise.resolve({
        id: 'valid-autor-id',
        nome: 'Autor Valido',
      } as Autor);
    }
    return Promise.resolve(null);
  }),
});

describe('LivroService', () => {
  let service: LivroService;
  let livroRepository: Repository<Livro>;
  let autorService: AutorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LivroService,
        {
          provide: getRepositoryToken(Livro),
          useFactory: mockLivroRepository,
        },
        {
          provide: AutorService,
          useFactory: mockAutorService,
        },
      ],
    }).compile();

    service = module.get<LivroService>(LivroService);
    livroRepository = module.get<Repository<Livro>>(getRepositoryToken(Livro));
    autorService = module.get<AutorService>(AutorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book with a valid author', async () => {
      const createLivroDto = {
        titulo: 'Novo Livro',
        anoPublicacao: 2020,
        autorId: 'valid-autor-id',
      };
      const mockAutor = { id: 'valid-autor-id', nome: 'Autor Valido' } as Autor;
      jest.spyOn(autorService, 'findOne').mockResolvedValue(mockAutor);

      const result = await service.create(createLivroDto);

      expect(autorService.findOne).toHaveBeenCalledWith('valid-autor-id');
      expect(livroRepository.create).toHaveBeenCalledWith({
        ...createLivroDto,
        autor: mockAutor,
      });
      expect(livroRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'livro-uuid',
        ...createLivroDto,
        autor: mockAutor,
      });
    });

    it('should throw BadRequestException if author is invalid', async () => {
      const createLivroDto = {
        titulo: 'Livro Sem Autor',
        anoPublicacao: 2020,
        autorId: 'invalid-autor-id',
      };

      jest.spyOn(autorService, 'findOne').mockResolvedValue(null as any);

      await expect(service.create(createLivroDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(livroRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book if found', async () => {
      const livro = {
        id: 'existing-livro-id',
        titulo: 'Livro Teste',
        autor: { id: 'autor-uuid', nome: 'Autor Teste' },
      } as Livro;
      jest.spyOn(livroRepository, 'findOne').mockResolvedValue(livro);
      const result = await service.findOne('existing-livro-id');
      expect(result).toEqual(livro);
    });

    it('should throw NotFoundException if book not found', async () => {
      jest.spyOn(livroRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('non-existent-livro-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      const result = await service.remove('existing-livro-id');
      expect(livroRepository.delete).toHaveBeenCalledWith('existing-livro-id');
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if book not found for deletion', async () => {
      await expect(service.remove('non-existent-livro-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
