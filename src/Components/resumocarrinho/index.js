import React from 'react';
import { useCarrinho } from 'Components/carrinhocontext';
import styles from './resumocarrinho.module.css';

const ResumoCarrinho = () => {
  const { quantidadeTotal, limparCarrinho } = useCarrinho();

  const handleFazerCotacao = () => {
    alert('Funcionalidade de cotação será implementada');
  };

  const handleLimparCarrinho = () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      limparCarrinho();
    }
  };

  return (
    <div className={styles.resumoCarrinho}>
      <h2>Resumo do Carrinho</h2>
      
      <div className={styles.resumoInfo}>
        <div className={styles.resumoLinha}>
          <span>Total de Itens:</span>
          <strong>{quantidadeTotal}</strong>
        </div>
      </div>

      <div className={styles.resumoBotoes}>
        <button 
          className={styles.btnFazerCotacao}
          onClick={handleFazerCotacao}
        >
          SOLICITAR COTAÇÃO
        </button>
        
        <button 
          className={styles.btnLimpar}
          onClick={handleLimparCarrinho}
        >
          LIMPAR CARRINHO
        </button>
      </div>

      <div className={styles.resumoObservacao}>
        <p>
          💡 <strong>Observação:</strong> Após fazer a cotação, nossa equipe 
          entrará em contato para fornecer os melhores preços e condições.
        </p>
      </div>
    </div>
  );
};

export default ResumoCarrinho;