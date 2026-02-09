const express = require('express');
const router = express.Router();
const db = require('./database');

// GET - Listar todos os eventos
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM eventos ORDER BY data_inicio DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET - Buscar evento por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM eventos WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    res.json(row);
  });
});

// POST - Criar novo evento
router.post('/', (req, res) => {
  const { titulo, data_inicio, data_fim, link } = req.body;
  
  if (!titulo || !data_inicio || !data_fim) {
    res.status(400).json({ error: 'Título, data início e data fim são obrigatórios' });
    return;
  }
  
  const sql = 'INSERT INTO eventos (titulo, data_inicio, data_fim, link) VALUES (?, ?, ?, ?)';
  
  db.run(sql, [titulo, data_inicio, data_fim, link], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    db.get('SELECT * FROM eventos WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json(row);
    });
  });
});

// PUT - Atualizar evento
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, data_inicio, data_fim, link } = req.body;
  
  const sql = `
    UPDATE eventos 
    SET titulo = ?, data_inicio = ?, data_fim = ?, link = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [titulo, data_inicio, data_fim, link, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    
    db.get('SELECT * FROM eventos WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(row);
    });
  });
});

// DELETE - Deletar evento
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM eventos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }
    
    res.json({ message: 'Evento deletado com sucesso', id });
  });
});

module.exports = router;