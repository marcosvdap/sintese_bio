import React, { useState } from 'react';
import ProdutoCard from 'Components/produtocard';
import { useProdutos } from '../../Components/catalogo/useProdutos';
import styles from './catalogo.module.css';
import Cabecalho from 'Components/Cabecalhocat';
import Rodape from 'Components/Rodape';
import Filtro from 'Components/filtro';

const Catalogo = () => {
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroAplicacao, setFiltroAplicacao] = useState('todos');
  const [busca, setBusca] = useState('');

  const { produtos, loading, error, filtrarProdutos, obterCategorias } = useProdutos();

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Carregando produtos...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>Erro: {error}</div>;

  const produtosFiltrados = filtrarProdutos(produtos, filtroCategoria, busca, filtroTipo, filtroAplicacao);
  const categorias = obterCategorias(produtos);
  
  const obterTipos = (produtos) => {
    const tipos = ['todos', ...new Set(produtos.map(p => p.tipo).filter(Boolean))];
    return tipos;
  };

  const obterAplicacoes = (produtos) => {
    const aplicacoesSet = new Set();
    
    produtos.forEach(produto => {
      if (produto.aplicacao) {
        const apps = produto.aplicacao.split(',').map(app => app.trim());
        apps.forEach(app => {
          if (app) aplicacoesSet.add(app);
        });
      }
    });
    
    return ['todos', ...Array.from(aplicacoesSet).sort()];
  };

  const tipos = obterTipos(produtos);
  const aplicacoes = obterAplicacoes(produtos);

  return (
    <div className={styles.container}>
      <Cabecalho />

      <Filtro
        busca={busca}
        setBusca={setBusca} 
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        filtroAplicacao={filtroAplicacao}
        setFiltroAplicacao={setFiltroAplicacao}
        categorias={categorias}
        tipos={tipos}
        aplicacoes={aplicacoes}
      />

      <div className={styles.content}>
        {produtosFiltrados.length === 0 ? (
          <div className={styles.emptyMessage}>
            {produtos.length === 0 ? 'Carregando produtos...' :
              `Nenhum produto encontrado`}
            <br />
            <small>Total de produtos: {produtos.length} | Filtrados: {produtosFiltrados.length}</small>
          </div>
        ) : (
          <div className={styles.grid}>
            {produtosFiltrados.map(produto => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </div>
      <Rodape />
    </div>
  );
};

export default Catalogo;