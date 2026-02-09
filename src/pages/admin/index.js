// src/pages/Admin/index.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProdutos } from '../../Components/catalogo/useProdutos';
import styles from './admin.module.css';

const Admin = () => {
  // --- Estados Globais da Página ---
  const [abaAtiva, setAbaAtiva] = useState('produtos'); // 'produtos' ou 'eventos'
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [uploading, setUploading] = useState(false); // 👈 NOVO: Estado de upload

  // --- LÓGICA DE PRODUTOS (Existente) ---
  const { 
    produtos, 
    loading: loadingProdutos, 
    error: errorProdutos,
    adicionarProduto, 
    atualizarProduto, 
    deletarProduto,
  } = useProdutos();
  
  const [formDataProduto, setFormDataProduto] = useState({
    nome: '', tipo: '', aplicacao: '', categoria: '', codigo_fabricante: '',
    descricao: '', link: '', imagem: '', destaque: 'F'
  });
  const [editandoProduto, setEditandoProduto] = useState(null);

  // --- LÓGICA DE EVENTOS (Existente) ---
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [errorEventos, setErrorEventos] = useState(null);
  const [formDataEvento, setFormDataEvento] = useState({
    titulo: '', data_inicio: '', data_fim: '', link: ''
  });
  const [editandoEvento, setEditandoEvento] = useState(null);

  // Limpar mensagem após 3 segundos
  useEffect(() => {
    if (mensagem.texto) {
      const timer = setTimeout(() => {
        setMensagem({ tipo: '', texto: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // --- 🖼️ NOVA FUNÇÃO DE UPLOAD DE IMAGEM ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    // 'imagemProduto' DEVE ser o mesmo nome usado no server.js (upload.single('imagemProduto'))
    formData.append('imagemProduto', file); 

    setUploading(true);
    setMensagem({ tipo: 'info', texto: 'Enviando imagem...' }); // 👈 NOVO TIPO 'info'

    try {
      const response = await fetch('/api/upload-imagem', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Falha no upload da imagem');
      }

      // SUCESSO! Atualiza o campo de imagem com o caminho do servidor
      setFormDataProduto(prev => ({
        ...prev,
        imagem: data.filePath 
      }));
      setMensagem({ tipo: 'sucesso', texto: 'Imagem enviada com sucesso!' });

    } catch (error) {
      console.error("Erro no upload:", error);
      setMensagem({ tipo: 'erro', texto: error.message || 'Erro ao enviar imagem.' });
    } finally {
      setUploading(false);
    }
  };


  // --- FUNÇÕES CRUD PRODUTOS ---
  const handleSubmitProduto = async (e) => {
    e.preventDefault();
    const produtoData = { ...formDataProduto };
    try {
      if (editandoProduto) {
        await atualizarProduto(editandoProduto, produtoData);
        setMensagem({ tipo: 'sucesso', texto: 'Produto atualizado com sucesso!' });
        setEditandoProduto(null);
      } else {
        await adicionarProduto(produtoData);
        setMensagem({ tipo: 'sucesso', texto: 'Produto adicionado com sucesso!' });
      }
      setFormDataProduto({
        nome: '', tipo: '', aplicacao: '', categoria: '', codigo_fabricante: '',
        descricao: '', link: '', imagem: '', destaque: 'F'
      });
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar produto!' });
    }
  };

  const handleEditProduto = (produto) => {
    setFormDataProduto({
      nome: produto.nome,
      tipo: produto.tipo || '',
      aplicacao: produto.aplicacao || '',
      categoria: produto.categoria,
      codigo_fabricante: produto.codigo_fabricante || '',
      descricao: produto.descricao || '',
      link: produto.link || '',
      imagem: produto.imagem || '',
      destaque: produto.destaque || 'F'
    });
    setEditandoProduto(produto.id);
    window.scrollTo(0, 0);
  };

  const handleDeleteProduto = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja deletar o produto "${nome}"?`)) {
      try {
        await deletarProduto(id);
        setMensagem({ tipo: 'sucesso', texto: 'Produto deletado com sucesso!' });
      } catch (error) {
        setMensagem({ tipo: 'erro', texto: 'Erro ao deletar produto!' });
      }
    }
  };

  // --- FUNÇÕES CRUD EVENTOS (Existente) ---
  const fetchEventos = useCallback(async () => {
    setLoadingEventos(true);
    setErrorEventos(null);
    try {
      const response = await fetch('/api/eventos');
      if (!response.ok) throw new Error('Falha ao buscar eventos');
      const data = await response.json();
      setEventos(data);
    } catch (err) {
      setErrorEventos(err.message);
    } finally {
      setLoadingEventos(false);
    }
  }, []);

  useEffect(() => {
    if (abaAtiva === 'eventos') {
      fetchEventos();
    }
  }, [abaAtiva, fetchEventos]);

  const formatDataParaInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60000));
      return localDate.toISOString().slice(0, 16);
    } catch (e) {
      return '';
    }
  };

  const formatDataParaTabela = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    const url = editandoEvento ? `/api/eventos/${editandoEvento}` : '/api/eventos';
    const method = editandoEvento ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataEvento)
      });
      if (!response.ok) throw new Error('Falha ao salvar evento');
      setMensagem({ tipo: 'sucesso', texto: `Evento ${editandoEvento ? 'atualizado' : 'adicionado'} com sucesso!` });
      setEditandoEvento(null);
      setFormDataEvento({ titulo: '', data_inicio: '', data_fim: '', link: '' });
      fetchEventos();
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar evento!' });
    }
  };

  const handleEditEvento = (evento) => {
    setFormDataEvento({
      titulo: evento.titulo,
      data_inicio: formatDataParaInput(evento.data_inicio),
      data_fim: formatDataParaInput(evento.data_fim),
      link: evento.link || ''
    });
    setEditandoEvento(evento.id);
    window.scrollTo(0, 0);
  };

  const handleDeleteEvento = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja deletar o evento "${titulo}"?`)) {
      try {
        const response = await fetch(`/api/eventos/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao deletar evento');
        setMensagem({ tipo: 'sucesso', texto: 'Evento deletado com sucesso!' });
        fetchEventos();
      } catch (error) {
        setMensagem({ tipo: 'erro', texto: 'Erro ao deletar evento!' });
      }
    }
  };

  // --- Listas de Filtros (Produtos) ---
  const categorias = ['IDT', 'Bio-Rad', 'Himedia', 'BiotechRabbit'];
  const tipos = ['Reagentes laboratoriais', 'Equipamentos', 'Serviço'];

  // --- Renderização ---
  if (loadingProdutos) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Carregando...</div>
          <div className={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>Painel de Administração</h1>
        <Link to="/catalogo" className={styles.catalogLink}>Ver Catálogo</Link>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${abaAtiva === 'produtos' ? styles.tabAtivo : ''}`}
          onClick={() => setAbaAtiva('produtos')}
        >
          Gerenciar Produtos
        </button>
        <button
          className={`${styles.tabButton} ${abaAtiva === 'eventos' ? styles.tabAtivo : ''}`}
          onClick={() => setAbaAtiva('eventos')}
        >
          Gerenciar Eventos
        </button>
      </div>

      {mensagem.texto && (
        <div className={
          mensagem.tipo === 'sucesso' ? styles.mensagemSucesso :
          mensagem.tipo === 'erro' ? styles.mensagemErro :
          styles.mensagemInfo // 👈 NOVO ESTILO
        }>
          {mensagem.texto}
        </div>
      )}

      {/* ================================================= */}
      {/* ===           PAINEL DE PRODUTOS              === */}
      {/* ================================================= */}
      {abaAtiva === 'produtos' && (
        <>
          <form className={styles.formContainer} onSubmit={handleSubmitProduto}>
            <h2 className={styles.formTitle}>
              {editandoProduto ? 'Editar' : 'Adicionar'} Produto
            </h2>
            
            {/* ... (campos nome, tipo, aplicacao, marca, cod_fabricante, descricao, link) ... */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome do Produto *</label>
              <input
                className={styles.input}
                type="text"
                value={formDataProduto.nome}
                onChange={(e) => setFormDataProduto({...formDataProduto, nome: e.target.value})}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo *</label>
              <select
                className={styles.select}
                value={formDataProduto.tipo}
                onChange={(e) => setFormDataProduto({...formDataProduto, tipo: e.target.value})}
                required
              >
                <option value="">Selecione um tipo</option>
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Aplicação (separe múltiplas por vírgula)</label>
              <input
                className={styles.input}
                type="text"
                value={formDataProduto.aplicacao}
                onChange={(e) => setFormDataProduto({...formDataProduto, aplicacao: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Marca/Fabricante *</label>
              <select
                className={styles.select}
                value={formDataProduto.categoria}
                onChange={(e) => setFormDataProduto({...formDataProduto, categoria: e.target.value})}
                required
              >
                <option value="">Selecione uma marca</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Código do Fabricante</label>
              <input
                className={styles.input}
                type="text"
                value={formDataProduto.codigo_fabricante}
                onChange={(e) => setFormDataProduto({...formDataProduto, codigo_fabricante: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Descrição</label>
              <textarea
                className={styles.textarea}
                rows="4"
                value={formDataProduto.descricao}
                onChange={(e) => setFormDataProduto({...formDataProduto, descricao: e.target.value})}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Link do Produto</label>
              <input
                className={styles.input}
                type="url"
                value={formDataProduto.link}
                onChange={(e) => setFormDataProduto({...formDataProduto, link: e.target.value})}
              />
            </div>
            
            {/* ========================================== */}
            {/* 🖼️ CAMPO DE IMAGEM ATUALIZADO */}
            {/* ========================================== */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Imagem do Produto</label>
              
              {/* Botão customizado de Upload */}
              <div className={styles.fileInputContainer}>
                <label htmlFor="file-upload" className={styles.fileInputButton}>
                  {uploading ? 'Enviando...' : 'Selecionar Imagem'}
                </label>
                <input 
                  id="file-upload"
                  className={styles.fileInputHidden}
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/webp"
                  disabled={uploading}
                />
              </div>

              {/* Status do Upload */}
              {uploading && (
                <div className={styles.uploadStatus}>
                  <div className={styles.uploadSpinner}></div>
                  Enviando, por favor aguarde...
                </div>
              )}

              {/* Campo de texto para URL (preenchido auto ou manual) */}
              <input
                className={styles.input}
                type="text"
                placeholder="URL da imagem (ex: /Imagens/produtos/nome.jpg)"
                value={formDataProduto.imagem}
                onChange={(e) => setFormDataProduto({...formDataProduto, imagem: e.target.value})}
                style={{marginTop: '10px'}}
                disabled={uploading}
              />
              
              {/* Preview da Imagem */}
              {formDataProduto.imagem && !uploading && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={formDataProduto.imagem} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}
            </div>
            {/* ========================================== */}
            {/* FIM DO CAMPO DE IMAGEM */}
            {/* ========================================== */}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Produto em Destaque?</label>
              <select
                className={styles.select}
                value={formDataProduto.destaque}
                onChange={(e) => setFormDataProduto({...formDataProduto, destaque: e.target.value})}
              >
                <option value="F">Não</option>
                <option value="T">Sim</option>
              </select>
            </div>
            
            <div className={styles.buttonGroup}>
              <button className={styles.buttonPrimary} type="submit" disabled={uploading}>
                {editandoProduto ? 'Atualizar' : 'Adicionar'} Produto
              </button>
              
              {editandoProduto && (
                <button 
                  className={styles.buttonSecondary}
                  type="button"
                  onClick={() => {
                    setEditandoProduto(null);
                    setFormDataProduto({
                      nome: '', tipo: '', aplicacao: '', categoria: '', codigo_fabricante: '',
                      descricao: '', link: '', imagem: '', destaque: 'F'
                    });
                  }}
                  disabled={uploading}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {/* Tabela de Produtos (sem alterações de lógica) */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>
                Produtos Cadastrados 
                <span className={styles.productCount}>({produtos.length})</span>
              </h2>
            </div>
            {errorProdutos && (
              <div className={styles.errorContainer}>
                <div className={styles.errorText}>{errorProdutos}</div>
              </div>
            )}
            {produtos.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📦</div>
                <div className={styles.emptyText}>Nenhum produto cadastrado ainda</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeadRow}>
                      <th className={styles.tableHeadCell}>ID</th>
                      <th className={styles.tableHeadCell}>Nome</th>
                      <th className={styles.tableHeadCell}>Marca</th>
                      <th className={styles.tableHeadCell}>Cód. Fabricante</th>
                      <th className={styles.tableHeadCell}>Destaque</th>
                      <th className={styles.tableHeadCell}>Ações</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {produtos.map((produto) => (
                      <tr key={produto.id}>
                        <td className={`${styles.tableCell} ${styles.productId}`}>{produto.id}</td>
                        <td className={`${styles.tableCell} ${styles.productName}`}>
                          <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {produto.nome}
                          </div>
                        </td>
                        <td className={styles.tableCell}><span className={styles.categoryBadge}>{produto.categoria}</span></td>
                        <td className={styles.tableCell}>{produto.codigo_fabricante || '-'}</td>
                        <td className={styles.tableCell} style={{textAlign: 'center'}}>{produto.destaque === 'T' ? '⭐' : '-'}</td>
                        <td className={styles.tableCell}>
                          <div className={styles.actionButtons}>
                            <button onClick={() => handleEditProduto(produto)} className={styles.btnEdit}>Editar</button>
                            <button onClick={() => handleDeleteProduto(produto.id, produto.nome)} className={styles.btnDelete}>Deletar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ================================================= */}
      {/* ===           PAINEL DE EVENTOS               === */}
      {/* ================================================= */}
      {abaAtiva === 'eventos' && (
        <>
          <form className={styles.formContainer} onSubmit={handleSubmitEvento}>
            <h2 className={styles.formTitle}>
              {editandoEvento ? 'Editar' : 'Adicionar'} Evento
            </h2>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Título do Evento *</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Ex: Workshop de qPCR"
                value={formDataEvento.titulo}
                onChange={(e) => setFormDataEvento({...formDataEvento, titulo: e.target.value})}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Data e Hora de Início *</label>
              <input
                className={styles.input}
                type="datetime-local"
                value={formDataEvento.data_inicio}
                onChange={(e) => setFormDataEvento({...formDataEvento, data_inicio: e.target.value})}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Data e Hora de Fim *</label>
              <input
                className={styles.input}
                type="datetime-local"
                value={formDataEvento.data_fim}
                onChange={(e) => setFormDataEvento({...formDataEvento, data_fim: e.target.value})}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Link de Inscrição (Opcional)</label>
              <input
                className={styles.input}
                type="url"
                placeholder="https://www.sympla.com.br/evento"
                value={formDataEvento.link}
                onChange={(e) => setFormDataEvento({...formDataEvento, link: e.target.value})}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button className={styles.buttonPrimary} type="submit">
                {editandoEvento ? 'Atualizar' : 'Adicionar'} Evento
              </button>
              
              {editandoEvento && (
                <button 
                  className={styles.buttonSecondary}
                  type="button"
                  onClick={() => {
                    setEditandoEvento(null);
                    setFormDataEvento({ titulo: '', data_inicio: '', data_fim: '', link: '' });
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {/* Tabela de Eventos (sem alterações de lógica) */}
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h2 className={styles.tableTitle}>
                Eventos Cadastrados 
                <span className={styles.productCount}>({eventos.length})</span>
              </h2>
            </div>
            {loadingEventos && (
              <div className={styles.emptyState}>
                <div className={styles.loadingSpinner} style={{ margin: '20px auto', borderTopColor: '#253785' }}></div>
                <div className={styles.emptyText}>Carregando eventos...</div>
              </div>
            )}
            {errorEventos && (
              <div className={styles.errorContainer}>
                <div className={styles.errorText}>{errorEventos}</div>
              </div>
            )}
            {!loadingEventos && eventos.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🗓️</div>
                <div className={styles.emptyText}>Nenhum evento cadastrado ainda</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeadRow}>
                      <th className={styles.tableHeadCell}>ID</th>
                      <th className={styles.tableHeadCell}>Título</th>
                      <th className={styles.tableHeadCell}>Início</th>
                      <th className={styles.tableHeadCell}>Fim</th>
                      <th className={styles.tableHeadCell}>Link</th>
                      <th className={styles.tableHeadCell}>Ações</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {eventos.map((evento) => (
                      <tr key={evento.id}>
                        <td className={`${styles.tableCell} ${styles.productId}`}>{evento.id}</td>
                        <td className={`${styles.tableCell} ${styles.productName}`}>{evento.titulo}</td>
                        <td className={styles.tableCell}>{formatDataParaTabela(evento.data_inicio)}</td>
                        <td className={styles.tableCell}>{formatDataParaTabela(evento.data_fim)}</td>
                        <td className={styles.tableCell}>
                          {evento.link ? (
                            <a href={evento.link} target="_blank" rel="noopener noreferrer" style={{color: '#007bff', fontSize: '14px'}}>🔗</a>
                          ) : '-'}
                        </td>
                        <td className={styles.tableCell}>
                          <div className={styles.actionButtons}>
                            <button onClick={() => handleEditEvento(evento)} className={styles.btnEdit}>Editar</button>
                            <button onClick={() => handleDeleteEvento(evento.id, evento.titulo)} className={styles.btnDelete}>Deletar</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Admin;