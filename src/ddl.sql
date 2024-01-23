DO $$
BEGIN
  -- Verifica se a tabela 'clientes' já existe, caso não exista, cria
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clientes') THEN
    CREATE TABLE clientes (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255),
      email VARCHAR(255),
      telefone VARCHAR(15),
      x FLOAT,
      y FLOAT
    );
  END IF;

  -- Verifica se a tabela 'rotas' já existe, caso não exista, cria
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rotas') THEN
    CREATE TABLE rotas (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255),
      email VARCHAR(255),
      telefone VARCHAR(15),
      x FLOAT,
      y FLOAT
    );
  END IF;

  IF NOT EXISTS
  ( SELECT 1
   FROM information_schema.columns
   WHERE table_name = 'rotas'
     AND column_name = 'cliente_id' ) THEN
ALTER TABLE rotas ADD COLUMN cliente_id INTEGER;

END IF;
END $$;

-- DROP TABLE clientes;
-- Este comando DROP TABLE está comentado, pode ser descomentado se for necessário remover a tabela 'clientes'
