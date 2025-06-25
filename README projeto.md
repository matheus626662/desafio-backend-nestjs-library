
# 📝 Desafio Técnico Backend - NestJS

## 🔧 Tecnologias obrigatórias:
- Node.js 22
- NestJS
- TypeORM (com SQLite ou PostgreSQL local)
- Swagger (documentação dos endpoints)
- Testes unitários (Jest)

## 📑 Descrição do Desafio
Desenvolver uma API REST para **gerenciamento de uma biblioteca simples**, com cadastro de livros e autores.

## 📚 Entidades

### Autor
- `id` (UUID)
- `nome` (string, obrigatório)
- `dataNascimento` (date, obrigatório)
- `nacionalidade` (string, opcional)
- Relacionamento: 1 autor pode ter vários livros.

### Livro
- `id` (UUID)
- `titulo` (string, obrigatório)
- `descricao` (string, opcional)
- `anoPublicacao` (number, obrigatório)
- `autorId` (relacionado ao autor)
- Relacionamento: cada livro pertence a 1 autor.

## 🔗 Relacionamento
- **1 Autor tem muitos livros.**
- **1 Livro pertence a 1 Autor.**

## 🔥 Funcionalidades obrigatórias

### Autor:
- Criar autor
- Listar autores
- Buscar autor por ID
- Atualizar autor
- Deletar autor

### Livro:
- Criar livro (sempre vinculado a um autor)
- Listar livros
- Buscar livro por ID
- Atualizar livro
- Deletar livro

## 🛠️ Regras de negócio
- Não é possível cadastrar um livro sem um autor válido.
- Ao deletar um autor, os livros dele também são excluídos (cascade delete).
- Não permitir autores com nomes duplicados.

## 📑 Documentação Swagger
- Todos os endpoints documentados no Swagger (`/api` ou `/swagger`).

## ✅ Testes unitários obrigatórios
- Pelo menos testes dos services de livro e autor.
- Teste de sucesso e teste de erro (ex.: tentativa de criar livro sem autor válido).

## 🚀 O que será avaliado?
- Organização do código.
- Estruturação dos módulos, services e controllers.
- Uso correto de TypeORM (entidades e relações).
- Clareza e completude da documentação Swagger.
- Qualidade dos testes unitários.
- Boas práticas de desenvolvimento.

## 🔗 Extras (não obrigatório, mas diferencial)
- Uso de DTOs bem estruturados.
- Validações com `class-validator`.
- Tratamento de erros com filtros personalizados.
- Uso de pipes e interceptors.

## 📤 Entrega

- Cada participante deve realizar o commit da sua solução em uma **branch separada com seu nome ou identificador**, dentro do repositório oficial do desafio.

**Exemplos de nome da branch:**
```
feature/nome-sobrenome
```
ou
```
dev/seu-nome
```

- Após finalizar, deve abrir um **Pull Request** para a branch `main` ou `develop` do repositório.

- O Pull Request deve conter na descrição:
  - Um breve resumo das decisões tomadas.
  - Quais partes foram mais fáceis ou mais desafiadoras.
  - Quais melhorias você faria se tivesse mais tempo.

> ✅ Trabalhar em uma branch dentro do mesmo repositório facilita centralizar a avaliação, além de permitir comparar diretamente as soluções dos participantes.
