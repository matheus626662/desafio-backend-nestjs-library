import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorService } from './autor.service';
import { AutorController } from './autor.controller';
import { Autor } from '../entities/autor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Autor])],
  providers: [AutorService],
  controllers: [AutorController],
  exports: [AutorService],
})
export class AutorModule {}
