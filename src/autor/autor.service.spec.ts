// src/autor/autor.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AutorService } from './autor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Autor } from '../entities/autor.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockAutorRepository = () => ({
  create: jest.fn((dto) => dto),
  save: jest.fn((autor) => Promise.resolve({ id: 'some-uuid', ...autor })),
  find: jest.fn(() => Promise.resolve([])),
  findOne: jest.fn((query) => {
    if (query.where.id === 'existing-id') {
      return Promise.resolve({
        id: 'existing-id',
        nome: 'Autor Teste',
        dataNascimento: '1900-01-01',
      });
    }
    if (query.where.nome === 'Autor Existente') {
      return Promise.resolve({
        id: 'existing-name-id',
        nome: 'Autor Existente',
        dataNascimento: '1900-01-01',
      });
    }
    return Promise.resolve(null);
  }),
  delete: jest.fn((id) =>
    Promise.resolve({ affected: id === 'existing-id' ? 1 : 0 }),
  ),
});

describe('AutorService', () => {
  let service: AutorService;
  let repository: Repository<Autor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutorService,
        {
          provide: getRepositoryToken(Autor),
          useFactory: mockAutorRepository,
        },
      ],
    }).compile();

    service = module.get<AutorService>(AutorService);
    repository = module.get<Repository<Autor>>(getRepositoryToken(Autor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new author', async () => {
      const createAutorDto = {
        nome: 'Novo Autor',
        dataNascimento: new Date('1990-01-01'),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result = await service.create(createAutorDto);
      expect(repository.create).toHaveBeenCalledWith(createAutorDto);
      expect(repository.save).toHaveBeenCalledWith(createAutorDto);
      expect(result).toEqual({ id: 'some-uuid', ...createAutorDto });
    });

    it('should throw ConflictException if author name already exists', async () => {
      const createAutorDto = {
        nome: 'Autor Existente',
        dataNascimento: new Date('1990-01-01'),
      };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce({
          id: 'existing-name-id',
          ...createAutorDto,
        } as Autor);

      await expect(service.create(createAutorDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an author if found', async () => {
      const autor = {
        id: 'existing-id',
        nome: 'Autor Teste',
        dataNascimento: new Date('1900-01-01'),
      } as Autor;
      jest.spyOn(repository, 'findOne').mockResolvedValue(autor);
      const result = await service.findOne('existing-id');
      expect(result).toEqual(autor);
    });

    it('should throw NotFoundException if author not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an author', async () => {
      const result = await service.remove('existing-id');
      expect(repository.delete).toHaveBeenCalledWith('existing-id');
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if author not found for deletion', async () => {
      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
