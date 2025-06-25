import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from '../entities/autor.entity';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';

@Injectable()
export class AutorService {
  constructor(
    @InjectRepository(Autor)
    private autorRepository: Repository<Autor>,
  ) {}

  async create(createAutorDto: CreateAutorDto): Promise<Autor> {
    const existingAutor = await this.autorRepository.findOne({
      where: { nome: createAutorDto.nome },
    });
    if (existingAutor) {
      throw new ConflictException(
        `Autor com o nome '${createAutorDto.nome}' já existe.`,
      );
    }
    const newAutor = this.autorRepository.create(createAutorDto);
    return this.autorRepository.save(newAutor);
  }

  findAll(): Promise<Autor[]> {
    return this.autorRepository.find();
  }

  async findOne(id: string): Promise<Autor> {
    const autor = await this.autorRepository.findOne({ where: { id } });
    if (!autor) {
      throw new NotFoundException(`Autor com ID '${id}' não encontrado.`);
    }
    return autor;
  }

  async update(id: string, updateAutorDto: UpdateAutorDto): Promise<Autor> {
    const autor = await this.findOne(id); // Reusa o findOne para verificar a existência
    if (updateAutorDto.nome && updateAutorDto.nome !== autor.nome) {
      const existingAutor = await this.autorRepository.findOne({
        where: { nome: updateAutorDto.nome },
      });
      if (existingAutor && existingAutor.id !== id) {
        throw new ConflictException(
          `Autor com o nome '${updateAutorDto.nome}' já existe.`,
        );
      }
    }
    Object.assign(autor, updateAutorDto);
    return this.autorRepository.save(autor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.autorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Autor com ID '${id}' não encontrado.`);
    }
  }
}
