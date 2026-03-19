-- 1. Cria a tabela de eventos (se não existir)
CREATE TABLE IF NOT EXISTS eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  data_inicio DATETIME NOT NULL,
  data_fim DATETIME,
  link TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insere eventos de exemplo
INSERT INTO eventos (titulo, data_inicio, data_fim, link) 
VALUES 
  ('Congresso Brasileiro de Biotecnologia', '2026-05-10 08:00:00', '2026-05-12 18:00:00', 'https://exemplo.com/congresso-biotec'),
  
  ('Simpósio de Equipamentos Laboratoriais', '2026-06-15 09:00:00', '2026-06-15 17:00:00', 'https://exemplo.com/simposio-lab'),
  
  ('Webinar: Novas Tecnologias em Análises Clínicas', '2026-04-20 14:00:00', '2026-04-20 16:00:00', 'https://exemplo.com/webinar-analises');

-- 3. Verifica os dados inseridos (opcional, apenas para ver o resultado na tela)
SELECT * FROM eventos;