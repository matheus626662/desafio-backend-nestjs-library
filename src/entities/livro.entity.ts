// src/entities/livro.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Autor } from './autor.entity';

@Entity()
export class Livro {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descricao: string;

  @Column('int')
  anoPublicacao: number;

  @ManyToOne(() => Autor, (autor) => autor.livros, { onDelete: 'CASCADE' })
  autor: Autor;
}
