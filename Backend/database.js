// Arquivo: Backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// MUDANÇA AQUI: Importando do mesmo diretório (sem ./utils/)
const importarProdutosCSV = require('./importar_csv');

const dbPath = path.join(__dirname, 'produtos.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
  } else {
    console.log('✅ Conectado ao banco SQLite');
    initDatabase();
  }
});

function initDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo TEXT NOT NULL,
      aplicacao TEXT NOT NULL,
      categoria TEXT NOT NULL,
      codigo_fabricante TEXT,
      descricao TEXT,
      link TEXT,
      imagem TEXT,
      destaque TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('Erro ao criar tabela produtos:', err);
    } else {
      criarTabelaEventos(); // -> Alterado: Agora chama a criação de eventos antes do userpadrao
    }
  });
}

// -> NOVA FUNÇÃO: Adicionada para criar a tabela de eventos
function criarTabelaEventos() {
  const sqlEventos = `
    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      data_inicio DATETIME NOT NULL,
      data_fim DATETIME,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(sqlEventos, (err) => {
    if (err) {
      console.error('Erro ao criar tabela eventos:', err);
    } else {
      userpadrao(); // Continua o fluxo normal do seu código
    }
  });
}

function userpadrao() {
   db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela users:', err);
    } else {
      const defaultPassword = bcrypt.hashSync('SinteseBio2024!', 10);
      
      db.run(
        `INSERT OR IGNORE INTO users (username, password, name, role) 
         VALUES (?, ?, ?, ?)`,
        ['admin@sintesebio.com.br', defaultPassword, 'Administrador', 'admin'],
        (err) => {
          if (err) console.error('Erro ao criar admin:', err);
          verificarEPopular();
        }
      );
    }
  });
}

function verificarEPopular() {
  db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
    if (err) {
      console.error('Erro ao verificar produtos:', err);
      return;
    }

    if (row.count === 0) {
      console.log('📝 Banco vazio. Iniciando importação...');
      
      // Chama a função importada
      importarProdutosCSV(db)
        .then(() => {
            console.log('✨ Inicialização concluída.');
        })
        .catch((erro) => {
            console.error('❌ Erro na importação:', erro.message);
        });

    } else {
      console.log(`📊 Banco já contém ${row.count} produtos.`);
    }
  });
}

module.exports = db;