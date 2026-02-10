// Arquivo: Backend/importar-produtos-csv.js
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// MUDANÇA AQUI: Como o arquivo js e o csv estão na mesma pasta, 
// removemos o ".." e apontamos direto para o arquivo.
const csvPath = path.join(__dirname, 'Produtos_ini.csv'); 

function importarProdutos(db) {
    return new Promise((resolve, reject) => {
        const produtos = [];
        
        // Verifica se o arquivo existe
        if (!fs.existsSync(csvPath)) {
            return reject(new Error(`Arquivo CSV não encontrado em: ${csvPath}`));
        }

        console.log('📂 Lendo arquivo CSV para popular banco...');

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                produtos.push({
                    nome: row.NOME,
                    tipo: row.TIPO,
                    aplicacao: row.APLICACAO,
                    categoria: row.categoria,
                    codigo_fabricante: row.codigo_fabricante || '',
                    descricao: row.descricao || '',
                    link: row.link || '',
                    imagem: row.imagem || '/Imagens/produtos/placeholder.png',
                    destaque: row.Destaque || 'F'
                });
            })
            .on('end', () => {
                console.log(`✅ CSV Lido: ${produtos.length} produtos encontrados.`);
                
                db.serialize(() => {
                    db.run("BEGIN TRANSACTION");

                    const stmt = db.prepare(`
                        INSERT INTO produtos (
                            nome, tipo, aplicacao, categoria, 
                            codigo_fabricante, descricao, link, imagem, destaque
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);

                    produtos.forEach((p) => {
                        stmt.run([
                            p.nome, p.tipo, p.aplicacao, p.categoria,
                            p.codigo_fabricante, p.descricao, p.link, p.imagem, p.destaque
                        ], (err) => {
                            if (err) console.error(`❌ Erro na linha ${p.nome}:`, err.message);
                        });
                    });

                    stmt.finalize((err) => {
                        if (err) {
                            db.run("ROLLBACK");
                            reject(err);
                        } else {
                            db.run("COMMIT", () => {
                                console.log(`🏁 Importação via CSV concluída!`);
                                resolve();
                            });
                        }
                    });
                });
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

module.exports = importarProdutos;