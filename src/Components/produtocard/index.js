import React, { useState } from 'react';
import { useCarrinho } from 'Components/carrinhocontext';
import styles from './produto.module.css';

const ProdutoCard = ({ produto }) => {
  const [modalAberto, setModalAberto] = useState(false);
  const { adicionarAoCarrinho } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const handleAdicionarCarrinho = (e) => {
    e.stopPropagation();
    adicionarAoCarrinho(produto);
    
    // Feedback visual
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  const handleAbrirLink = () => {
    if (produto.link) {
      window.open(produto.link, '_blank');
    }
  };

  return (
    <>
      {/* Card - MANTÉM ORIGINAL, SEM BOTÃO ADICIONAR */}
      <div className={styles.carroselCard} onClick={abrirModal}>
        <div className={styles.imageContainer}>
          <img src={produto.imagem} alt={produto.nome} />
        </div>
        <div className={styles.carroselCardContent}>
          <h3>{produto.nome}</h3>
          <button className={styles.cardBtn}>
            VER DETALHES
          </button>
        </div>
      </div>

      {/* Modal - ADICIONA BOTÃO AQUI */}
      {modalAberto && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.btnFecharModal} onClick={fecharModal}>
              ✕
            </button>

            <div className={styles.modalBody}>
              <div className={styles.modalImagem}>
                <img src={produto.imagem} alt={produto.nome} />
              </div>

              <div className={styles.modalInfo}>
                <h2>{produto.nome}</h2>
                
                <div className={styles.infoSection}>
                  <p className={styles.infoLabel}>Identificador:</p>
                  <p className={styles.infoTexto}>{produto.codigo_fabricante || 'N/A'}</p>
                </div>

                <div className={styles.infoSection}>
                  <p className={styles.infoLabel}>Categoria:</p>
                  <p className={styles.infoTexto}>{produto.categoria}</p>
                </div>

                <div className={styles.infoSection}>
                  <p className={styles.infoDescricao}>
                    {produto.descricao || 'Descrição não disponível'}
                  </p>
                </div>

                <div className={styles.modalBotoes}>
                  <button 
                    className={styles.btnDetalhes}
                    onClick={handleAbrirLink}
                    disabled={!produto.link}
                  >
                    DETALHES SOBRE O PRODUTO
                  </button>
                  {/* BOTÃO ADICIONAR APENAS NO MODAL */}
                  <button 
                    className={`${styles.btnAdicionar} ${adicionado ? styles.adicionado : ''}`}
                    onClick={handleAdicionarCarrinho}
                  >
                    {adicionado ? '✓ ADICIONADO AO CARRINHO' : 'ADICIONAR AO CARRINHO'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProdutoCard;