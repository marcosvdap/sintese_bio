const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const { link } = require('fs');


// Criar/conectar ao banco SQLite
const db = new sqlite3.Database(path.join(__dirname, 'produtos.db'), (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('✅ Conectado ao banco SQLite');
    initDatabase();
  }
});
// Criar tabelas se não existirem
function initDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo text not null,
      aplicacao text not null,
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
      console.error('Erro ao criar tabela:', err);
    } else {
      console.log('✅ Tabela produtos pronta');
      userpadrao();
      
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
      console.log('✅ Tabela users pronta');

      // Criar usuário admin padrão se não existir
      const defaultPassword = bcrypt.hashSync('SinteseBio2024!', 10);
      db.run(
        `INSERT OR IGNORE INTO users (username, password, name, role) 
       VALUES (?, ?, ?, ?)`,
        ['admin@sintesebio.com.br', defaultPassword, 'Administrador', 'admin'],
        (err) => {
          if (!err) console.log('✅ Usuário admin padrão criado');
          verificarEPopular();
        }
      );
    }
  });
}

// Popular com dados iniciais se estiver vazia
function verificarEPopular() {
  db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
    if (err) {
      console.error('Erro ao verificar produtos:', err);
      return;
    }

    if (row.count === 0) {
      console.log('📝 Populando banco com dados iniciais...');
      popularDadosIniciais();
    } else {
      console.log(`📊 Banco já contém ${row.count} produtos`);
    }
  });
}

function popularDadosIniciais() {
  const produtos = [
    {
      nome: "desenvolvimento licenciamento",
      tipo: "Serviço",
      aplicacao: "Serviço",
      categoria: "IDT",
      codigo_fabricante: "Bases",
      descricao: "Kit completo para extração de DNA de alta qualidade",
      link: "https://www.sintesebio.com.br/servicos/desenvolvimento-e-licenciamento",
      imagem: "/Imagens/produtos/placeholder.png",
      destaque: "F",
    },
    {
      nome: "desenvolvimento licenciamento",
      tipo: "Serviço",
      aplicacao: "Serviço",
      categoria: "IDT",
      codigo_fabricante: "Bases",
      descricao: "Kit completo para extração de DNA de alta qualidade",
      link: "https://www.sintesebio.com.br/servicos/desenvolvimento-e-licenciamento",
      imagem: "/Imagens/produtos/placeholder.png",
      destaque: "F",
    },
    {
      nome: "desenvolvimento licenciamento",
      tipo: "Serviço",
      aplicacao: "Serviço",
      categoria: "IDT",
      codigo_fabricante: "Bases",
      descricao: "Kit completo para extração de DNA de alta qualidade",
      link: "https://www.sintesebio.com.br/servicos/desenvolvimento-e-licenciamento",
      imagem: "/Imagens/produtos/placeholder.png",
      destaque: "F",
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO produtos (nome, tipo, aplicacao, categoria, codigo_fabricante , descricao, link, imagem,destaque) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  produtos.forEach(produto => {
    stmt.run(
      produto.nome,
      produto.categoria,
      produto.codigo_fabricante,
      produto.tipo,
      produto.aplicacao,
      produto.descricao,
      produto.link,
      produto.imagem,
      produto.destaque
    );
  });

  stmt.finalize();
  console.log('✅ Dados iniciais inseridos com sucesso!');
}

module.exports = db;