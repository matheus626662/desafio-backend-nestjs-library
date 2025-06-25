import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Livro } from '../entities/livro.entity';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import { AutorService } from '../autor/autor.service'; // Para validar o autor

@Injectable()
export class LivroService {
  constructor(
    @InjectRepository(Livro)
    private livroRepository: Repository<Livro>,
    private autorService: AutorService, // Injeta o AutorService
  ) {}

  async create(createLivroDto: CreateLivroDto): Promise<Livro> {
    const autor = await this.autorService.findOne(createLivroDto.autorId); // Verifica se o autor existe
    if (!autor) {
      throw new BadRequestException(
        'Autor inválido. Não é possível cadastrar um livro sem um autor válido.',
      );
    }
    const newLivro = this.livroRepository.create({
      ...createLivroDto,
      autor: autor, // Associa o objeto autor ao livro
    });
    return this.livroRepository.save(newLivro);
  }

  findAll(): Promise<Livro[]> {
    return this.livroRepository.find({ relations: ['autor'] }); // Carrega o autor junto
  }

  async findOne(id: string): Promise<Livro> {
    const livro = await this.livroRepository.findOne({
      where: { id },
      relations: ['autor'],
    });
    if (!livro) {
      throw new NotFoundException(`Livro com ID '${id}' não encontrado.`);
    }
    return livro;
  }

  async update(id: string, updateLivroDto: UpdateLivroDto): Promise<Livro> {
    const livro = await this.findOne(id);

    if (updateLivroDto.autorId && updateLivroDto.autorId !== livro.autor.id) {
      const novoAutor = await this.autorService.findOne(updateLivroDto.autorId);
      if (!novoAutor) {
        throw new BadRequestException('Novo autor inválido para o livro.');
      }
      livro.autor = novoAutor;
    }

    Object.assign(livro, updateLivroDto);
    return this.livroRepository.save(livro);
  }

  async remove(id: string): Promise<void> {
    const result = await this.livroRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Livro com ID '${id}' não encontrado.`);
    }
  }
}
