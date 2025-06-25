import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LivroService } from './livro.service';
import { CreateLivroDto } from './dto/create-livro.dto';
import { UpdateLivroDto } from './dto/update-livro.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Livros')
@Controller('livros')
export class LivroController {
  constructor(private readonly livroService: LivroService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo livro' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Livro criado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Autor inválido ou dados incorretos.',
  })
  @ApiBody({ type: CreateLivroDto })
  create(@Body() createLivroDto: CreateLivroDto) {
    return this.livroService.create(createLivroDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os livros' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de livros retornada com sucesso.',
  })
  findAll() {
    return this.livroService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um livro por ID' })
  @ApiParam({ name: 'id', description: 'ID do livro', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Livro encontrado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Livro não encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.livroService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um livro existente' })
  @ApiParam({ name: 'id', description: 'ID do livro', type: 'string' })
  @ApiBody({ type: UpdateLivroDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Livro atualizado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Livro não encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Autor inválido para atualização.',
  })
  update(@Param('id') id: string, @Body() updateLivroDto: UpdateLivroDto) {
    return this.livroService.update(id, updateLivroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta um livro por ID' })
  @ApiParam({ name: 'id', description: 'ID do livro', type: 'string' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Livro deletado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Livro não encontrado.',
  })
  remove(@Param('id') id: string) {
    return this.livroService.remove(id);
  }
}
