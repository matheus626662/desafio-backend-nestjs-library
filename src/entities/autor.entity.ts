// src/entities/autor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'; // <-- Importe OneToMany
import { Livro } from './livro.entity';

@Entity() // <-- Adicione os parênteses
export class Autor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column('date')
  dataNascimento: Date;

  @Column({ nullable: true })
  nacionalidade: string;

  @OneToMany(() => Livro, (livro) => livro.autor, { cascade: true })
  livros: Livro[];
}
