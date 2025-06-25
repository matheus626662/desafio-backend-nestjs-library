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
import { AutorService } from './autor.service'; // Ajustado o caminho do import
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Autores')
@Controller('autores')
export class AutorController {
  constructor(private readonly autorService: AutorService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo autor' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Autor criado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Autor com este nome já existe.',
  })
  @ApiBody({ type: CreateAutorDto })
  create(@Body() createAutorDto: CreateAutorDto) {
    return this.autorService.create(createAutorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os autores' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de autores retornada com sucesso.',
  })
  findAll() {
    return this.autorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um autor por ID' })
  @ApiParam({ name: 'id', description: 'ID do autor', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Autor encontrado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Autor não encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.autorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um autor existente' })
  @ApiParam({ name: 'id', description: 'ID do autor', type: 'string' })
  @ApiBody({ type: UpdateAutorDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Autor atualizado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Autor não encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Autor com o nome atualizado já existe.',
  })
  update(@Param('id') id: string, @Body() updateAutorDto: UpdateAutorDto) {
    return this.autorService.update(id, updateAutorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta um autor por ID' })
  @ApiParam({ name: 'id', description: 'ID do autor', type: 'string' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Autor deletado com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Autor não encontrado.',
  })
  remove(@Param('id') id: string) {
    return this.autorService.remove(id);
  }
}
