-- Verifica se há uma tabela cadastrada, caso não há cria uma nova, caso haja ignora

DO $$
 BEGIN
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
 END $$;

--* ----------------------------------------------------------------------------------------------

-- SHOW COLUMNS FROM produtos
-- DROP TABLE clientes