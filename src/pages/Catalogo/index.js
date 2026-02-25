import React, { useState, useEffect } from 'react';
import ProdutoCard from 'Components/produtocard'; // Seu componente original
import { useProdutos } from '../../Components/catalogo/useProdutos';
import styles from './catalogo.module.css';
import Cabecalho from 'Components/Cabecalhocat';
import Rodape from 'Components/Rodape';
import Filtro from 'Components/filtro';

const Catalogo = () => {
  // --- Filtros ---
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroAplicacao, setFiltroAplicacao] = useState('todos');
  const [busca, setBusca] = useState('');

  // --- Paginação Simples ---
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 9; 

  const { produtos, loading, error, filtrarProdutos, obterCategorias } = useProdutos();

  // Volta para página 1 se filtrar
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroCategoria, filtroTipo, filtroAplicacao, busca]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Erro: {error}</div>;

  // 1. Filtra
  const produtosFiltrados = filtrarProdutos(produtos, filtroCategoria, busca, filtroTipo, filtroAplicacao);
  
  // 2. Calcula total de páginas
  const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);

  // 3. Fatia (Slice) para pegar só os produtos desta página
  const indexInicial = (paginaAtual - 1) * itensPorPagina;
  const indexFinal = indexInicial + itensPorPagina;
  const produtosDaPagina = produtosFiltrados.slice(indexInicial, indexFinal);

  // --- Helpers de Categoria (mantido igual) ---
  const categorias = obterCategorias(produtos);
  const obterTipos = (lista) => ['todos', ...new Set(lista.map(p => p.tipo).filter(Boolean))];
  const obterAplicacoes = (lista) => {
    const apps = new Set();
    lista.forEach(p => p.aplicacao?.split(',').forEach(a => a.trim() && apps.add(a.trim())));
    return ['todos', ...Array.from(apps).sort()];
  };

  // Funções de navegação simples
  const irParaProxima = () => {
    setPaginaAtual(prev => Math.min(prev + 1, totalPaginas));
    window.scrollTo({ top: 0, behavior: 'smooth' })

  };

  const irParaAnterior = () => {
    setPaginaAtual(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
  };

  return (
    <div className={styles.container}>
      <Cabecalho />

      <Filtro
        busca={busca} setBusca={setBusca} 
        filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria}
        filtroTipo={filtroTipo} setFiltroTipo={setFiltroTipo}
        filtroAplicacao={filtroAplicacao} setFiltroAplicacao={setFiltroAplicacao}
        categorias={categorias} tipos={obterTipos(produtos)} aplicacoes={obterAplicacoes(produtos)}
      />

      <div className={styles.content}>
        {produtosFiltrados.length === 0 ? (
          <div className={styles.emptyMessage}>Nenhum produto encontrado.</div>
        ) : (
          <>
            {/* GRID DE PRODUTOS */}
            <div className={styles.grid}>
              {produtosDaPagina.map(produto => (
                /* O key é essencial para o Modal funcionar corretamente */
                <ProdutoCard key={produto.id || produto.codigo} produto={produto} />
              ))}
            </div>

            {/* PAGINAÇÃO SIMPLES */}
            {totalPaginas > 1 && (
              <div className={styles.paginacaoSimples}>
                <button 
                  onClick={irParaAnterior} 
                  disabled={paginaAtual === 1}
                  className={styles.btnNav}
                >
                  ❮ Anterior
                </button>

                <span className={styles.infoPagina}>
                  Página <strong>{paginaAtual}</strong> de {totalPaginas}
                </span>

                <button 
                  onClick={irParaProxima} 
                  disabled={paginaAtual === totalPaginas}
                  className={styles.btnNav}
                >
                  Próximo ❯
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Rodape />
    </div>
  );
};

export default Catalogo;