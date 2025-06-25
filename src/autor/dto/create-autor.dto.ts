import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAutorDto {
  @ApiProperty({
    description: 'Nome completo do autor',
    example: 'Machado de Assis',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Data de nascimento do autor (AAAA-MM-DD)',
    example: '1839-06-21',
  })
  @IsDateString()
  @IsNotEmpty()
  dataNascimento: Date;

  @ApiProperty({
    description: 'Nacionalidade do autor',
    example: 'Brasileira',
    required: false,
  })
  @IsString()
  @IsOptional()
  nacionalidade?: string;
}
