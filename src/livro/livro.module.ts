import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivroService } from './livro.service';
import { LivroController } from './livro.controller';
import { Livro } from '../entities/livro.entity';
import { AutorModule } from '../autor/autor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Livro]), AutorModule],
  providers: [LivroService],
  controllers: [LivroController],
})
export class LivroModule {}
