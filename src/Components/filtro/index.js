import React, { useState } from 'react';
import styles from './filtro.module.css';

const Filtro = ({ 
  busca, 
  setBusca, 
  filtroCategoria, 
  setFiltroCategoria,
  filtroTipo,
  setFiltroTipo,
  filtroAplicacao,
  setFiltroAplicacao,
  categorias,
  tipos,
  aplicacoes
}) => {
  const [filtroAberto, setFiltroAberto] = useState(false);

  console.log('FiltrosBusca - categorias recebidas:', categorias);

  return (
    <>
      <div className={styles.filtrosContainer}>
        <div className={styles.buscaWrapper}>
          <svg 
            className={styles.searchIcon} 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) => {
              console.log('Busca alterada para:', e.target.value);
              setBusca(e.target.value);
            }}
            className={styles.buscaInput}
          />
        </div>
      </div>

      <div className={styles.filtroHeader} onClick={() => setFiltroAberto(!filtroAberto)}>
        <div className={styles.filtroTitulo}>
          <svg 
            className={styles.filtroIcon} 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#FCC204" 
            strokeWidth="2"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          <span>FILTROS</span>
          <svg 
            className={`${styles.chevron} ${filtroAberto ? styles.aberto : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {filtroAberto && (
        <div className={styles.filtroContent}>
          {categorias && categorias.length > 0 ? (
            <div className={styles.filtroSecao}>
              <h3 className={styles.filtroSubtitulo}>MARCAS</h3>
              <div className={styles.filtroButtons}>
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => {
                      console.log('Categoria alterada para:', categoria);
                      setFiltroCategoria(categoria);
                    }}
                    className={`${styles.filtroBtn} ${filtroCategoria === categoria ? styles.active : ''}`}
                  >
                    {categoria === 'todos' ? 'Todos' : categoria}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>Carregando categorias...</div>
          )}

          {tipos && tipos.length > 0 && (
            <div className={styles.filtroSecao}>
              <h3 className={styles.filtroSubtitulo}>TIPO</h3>
              <div className={styles.filtroButtons}>
                {tipos.map(tipo => (
                  <button
                    key={tipo}
                    onClick={() => {
                      console.log('Tipo alterado para:', tipo);
                      setFiltroTipo(tipo);
                    }}
                    className={`${styles.filtroBtn} ${filtroTipo === tipo ? styles.active : ''}`}
                  >
                    {tipo === 'todos' ? 'Todos' : tipo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {aplicacoes && aplicacoes.length > 0 && (
            <div className={styles.filtroSecao}>
              <h3 className={styles.filtroSubtitulo}>APLICAÇÕES</h3>
              <div className={styles.filtroButtons}>
                {aplicacoes.map(aplicacao => (
                  <button
                    key={aplicacao}
                    onClick={() => {
                      console.log('Aplicação alterada para:', aplicacao);
                      setFiltroAplicacao(aplicacao);
                    }}
                    className={`${styles.filtroBtn} ${filtroAplicacao === aplicacao ? styles.active : ''}`}
                  >
                    {aplicacao === 'todos' ? 'Todos' : aplicacao}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Filtro;