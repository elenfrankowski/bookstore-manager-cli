# BookStore Manager CLI

Aplicação de linha de comando (CLI) para gerenciamento de uma pequena livraria, desenvolvida como projeto final do módulo de Back End com Node.js.

## Sumário

- [Descrição do Projeto](#descrição-do-projeto)
- [Objetivo](#objetivo)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Requisitos para Execução](#requisitos-para-execução)
- [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Instalação](#instalação)
- [Execução](#execução)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Exemplo de Utilização](#exemplo-de-utilização)
- [Integrantes da Equipe](#integrantes-da-equipe)
- [Repositório](#repositório)

## Descrição do Projeto

O BookStore Manager CLI é um sistema executado via terminal que permite administrar autores, livros, clientes e empréstimos de uma livraria, utilizando o PostgreSQL como banco de dados para armazenamento permanente das informações. O sistema substitui o controle manual de registros por uma aplicação estruturada em camadas, com validações de regras de negócio e relatórios gerenciais.

## Objetivo

Consolidar, em um projeto prático, os principais conhecimentos desenvolvidos ao longo do curso:

- gerenciar autores, livros, clientes e empréstimos;
- persistir informações em um banco de dados PostgreSQL;
- aplicar regras de negócio durante as operações do sistema;
- realizar consultas relacionais utilizando SQL;
- gerar relatórios a partir dos dados armazenados;
- organizar o código em camadas, promovendo modularização e reutilização;
- utilizar recursos da linguagem TypeScript, programação orientada a objetos e programação assíncrona.

## Tecnologias Utilizadas

- **Node.js** — ambiente de execução
- **TypeScript** — linguagem principal do projeto
- **PostgreSQL** — banco de dados relacional
- **pg** — driver de conexão com o PostgreSQL
- **dotenv** — gerenciamento de variáveis de ambiente
- **tsx** — execução de TypeScript sem necessidade de compilação prévia
- **ESLint + typescript-eslint** — padronização e qualidade de código
- **Prettier** — formatação automática de código
- **Docker / Docker Compose** — orquestração do banco de dados

## Requisitos para Execução

Antes de iniciar, é necessário ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose

Não é necessário ter o PostgreSQL instalado localmente. O banco de dados é executado inteiramente via container Docker.

## Configuração do Banco de Dados

O banco de dados é criado automaticamente a partir do script SQL disponibilizado no repositório (`src/@common/database/schema.sql`), montado como script de inicialização do container Docker. Não é enviado nenhum banco previamente populado, toda a estrutura (tabelas, chaves primárias e estrangeiras) é criada na primeira inicialização do container.

O `docker-compose.yml` já define as credenciais do banco:

| Variável              | Valor          |
| --------------------- | -------------- |
| Usuário               | `admin`        |
| Senha                 | `password123`  |
| Banco                 | `bookstore-db` |
| Porta exposta no host | `5433`         |

> A porta `5433` foi utilizada (em vez da padrão `5432`) para evitar conflito com uma instância local de PostgreSQL já em uso na máquina de desenvolvimento. Caso não haja conflito no seu ambiente, é possível alterar para `5432:5432` no `docker-compose.yml`, desde que o `.env` seja atualizado de forma correspondente.

### Criando o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```dotenv
DB_USER=admin
DB_PASSWORD=password123
DB_HOST=localhost
DB_PORT=5433
DB_NAME=bookstore-db
```

## Instalação

```bash
# Clone o repositório
git clone https://github.com/elenfrankowski/bookstore-manager-cli.git

# Acesse a pasta do projeto
cd bookstore-manager-cli

# Instale as dependências
npm install
```

## Execução

### 1. Subir o banco de dados

```bash
docker compose up -d
```

Na primeira execução, o container irá criar automaticamente todas as tabelas definidas no `schema.sql`.

### 2. Rodar a aplicação

```bash
npm run start
```

### Compilação (opcional)

Para compilar o projeto TypeScript em JavaScript puro (gerado na pasta `dist/`):

```bash
npm run build
```

## Arquitetura do Projeto

A aplicação segue uma arquitetura organizada em camadas, com responsabilidades bem definidas e baixo acoplamento entre os módulos:

```
Usuário (terminal)
    ↓
View (MainView) — navegação entre menus
    ↓
Controllers — interação com o terminal, leitura de input e exibição de resultados
    ↓
UseCases — regras de negócio, validações e orquestração das operações
    ↓
Repositories — comunicação exclusiva com o PostgreSQL via SQL
    ↓
Database (Pool de conexão)
```

### Decisões de arquitetura

- **Injeção de Dependência via construtor**: todas as classes (Repositories, UseCases, Controllers) recebem suas dependências através do construtor, em vez de instanciá-las internamente. O `main.ts` é responsável por montar (fazer a "fiação") de todas as dependências e injetá-las na `MainView`, mantendo cada classe com responsabilidade única e facilitando manutenção e testes.
- **Padrão Use Case granular**: em vez de uma única classe `Service` por entidade contendo todos os métodos, cada ação de negócio (`CriarAutorUseCase`, `AtualizarLivroUseCase`, etc.) possui sua própria classe, com um único método público (`executar`). Essa escolha foi baseada em um repositório de referência compartilhado pelo professor, e reforça o princípio de responsabilidade única.
- **Tratamento de erros centralizado nos Controllers**: cada Controller possui um único bloco `try/catch` no loop principal do menu, que captura qualquer erro lançado pelos UseCases (validações de negócio) e violações de integridade do banco (chaves estrangeiras), exibindo mensagens claras ao usuário sem interromper a execução da aplicação.

## Funcionalidades Implementadas

### Autores

- Cadastrar, listar, buscar por ID, atualizar e remover autores
- Validação de nome duplicado
- Bloqueio de remoção de autor vinculado a livros cadastrados

### Livros

- Cadastrar, listar, buscar por ID, atualizar e remover livros
- Validação de existência do autor vinculado
- Validação de ISBN duplicado
- Bloqueio de remoção de livro vinculado a empréstimos

### Clientes

- Cadastrar, listar, buscar por ID, atualizar e remover clientes
- Validação de e-mail duplicado
- Bloqueio de remoção de cliente vinculado a empréstimos

### Empréstimos

- Realizar empréstimo, com validação de existência de cliente, livro e disponibilidade de exemplares
- Impedir empréstimo duplicado (mesmo cliente e mesmo livro simultaneamente ativos)
- Registrar devolução, com atualização automática da quantidade disponível do livro

### Relatórios

- Livros disponíveis
- Livros emprestados (ativos)
- Livros cadastrados por autor
- Quantidade de empréstimos por livro
- Clientes com empréstimos ativos
- _(Diferencial)_ Top 5 livros mais emprestados
- _(Diferencial)_ Top 5 clientes mais ativos

## Estrutura de Pastas

```
src/
├── @common/
│   ├── database/          # Conexão com PostgreSQL e schema.sql
│   └── utils/              # Utilitários compartilhados (leitor de terminal)
├── controllers/            # Camada de interação com o terminal
├── model/                  # Interfaces e tipos das entidades
├── repositories/           # Camada de acesso ao banco de dados (SQL puro)
├── usecase/
│   ├── autor/
│   ├── cliente/
│   ├── livro/
│   ├── emprestimo/
│   └── relatorio/
├── view/                   # Menu principal da aplicação
└── main.ts                 # Ponto de entrada da aplicação
```

## Exemplo de Utilização

```
====================================
       GERENCIADOR DA LIVRARIA
====================================

1. Gerenciar Autores
2. Gerenciar Clientes
3. Gerenciar Livros
4. Gerenciar Empréstimos
5. Relatórios Avançados
0. Sair do Sistema
====================================

Escolha uma opção: 1

=== GERENCIAR AUTORES ===

1. Cadastrar autor
2. Listar autores
3. Buscar autor por ID
4. Atualizar autor
5. Remover autor
0. Voltar ao menu principal

Escolha uma opção: 1
Nome do autor: Machado de Assis

Autor "Machado de Assis" cadastrado com sucesso! (ID: 1)
```

## Integrantes da Equipe

- Elen Frankowski (projeto individual)

## Repositório

[https://github.com/elenfrankowski/bookstore-manager-cli](https://github.com/elenfrankowski/bookstore-manager-cli)
