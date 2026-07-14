DROP TABLE IF EXISTS emprestimo CASCADE;
DROP TABLE IF EXISTS livro CASCADE;
DROP TABLE IF EXISTS autor CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;

CREATE TABLE cliente (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE autor (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE livro (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    autor_id INT NOT NULL,
    total_exemplares INT NOT NULL CONSTRAINT chk_total CHECK (total_exemplares >= 0),
    disponiveis INT NOT NULL CONSTRAINT chk_disponiveis CHECK (disponiveis >= 0),

    CONSTRAINT chk_estoque_coerente CHECK (disponiveis <= total_exemplares),
    CONSTRAINT fk_livro_autor FOREIGN KEY (autor_id) REFERENCES autor (id) ON DELETE RESTRICT
);

CREATE TABLE emprestimo (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    livro_id INT NOT NULL,
    cliente_id INT NOT NULL,
    data_emprestimo TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_devolucao TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ATIVO' NOT NULL CONSTRAINT chk_status CHECK (status IN ('ATIVO', 'DEVOLVIDO', 'CANCELADO')),

    CONSTRAINT fk_emprestimo_livro FOREIGN KEY (livro_id) REFERENCES livro (id) ON DELETE RESTRICT,
    CONSTRAINT fk_emprestimo_cliente FOREIGN KEY (cliente_id) REFERENCES cliente (id) ON DELETE RESTRICT
);