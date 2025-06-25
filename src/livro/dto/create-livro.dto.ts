import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLivroDto {
  @ApiProperty({ description: 'Título do livro', example: 'Dom Casmurro' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    description: 'Descrição do livro',
    example: 'Um romance clássico da literatura brasileira.',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ description: 'Ano de publicação do livro', example: 1899 })
  @IsNumber()
  @IsNotEmpty()
  anoPublicacao: number;

  @ApiProperty({
    description: 'ID do autor do livro (UUID)',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  @IsNotEmpty()
  autorId: string;
}
