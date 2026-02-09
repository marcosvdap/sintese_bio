import React from 'react';
import { useCarrinho } from 'Components/carrinhocontext';
import styles from './itemcarrinho.module.css';

const ItemCarrinho = ({ item }) => {
  const { atualizarQuantidade, removerDoCarrinho } = useCarrinho();

  const handleQuantidadeChange = (e) => {
    const novaQuantidade = parseInt(e.target.value);
    if (novaQuantidade > 0) {
      atualizarQuantidade(item.id, novaQuantidade);
    }
  };

  const aumentarQuantidade = () => {
    atualizarQuantidade(item.id, item.quantidade + 1);
  };

  const diminuirQuantidade = () => {
    if (item.quantidade > 1) {
      atualizarQuantidade(item.id, item.quantidade - 1);
    }
  };

  return (
    <div className={styles.itemCarrinho}>
      <div className={styles.itemImagem}>
        <img src={item.imagem} alt={item.nome} />
      </div>

      <div className={styles.itemInfo}>
        <h3>{item.nome}</h3>
        <p className={styles.itemCategoria}>{item.categoria}</p>
        {item.codigo_fabricante && (
          <p className={styles.itemCodigo}>
            Cód: {item.codigo_fabricante}
          </p>
        )}
      </div>

      <div className={styles.itemQuantidade}>
        <button 
          className={styles.btnQuantidade}
          onClick={diminuirQuantidade}
          disabled={item.quantidade <= 1}
        >
          -
        </button>
        <input 
          type="number" 
          value={item.quantidade}
          onChange={handleQuantidadeChange}
          className={styles.inputQuantidade}
          min="1"
        />
        <button 
          className={styles.btnQuantidade}
          onClick={aumentarQuantidade}
        >
          +
        </button>
      </div>

      <button 
        className={styles.btnRemover}
        onClick={() => removerDoCarrinho(item.id)}
        title="Remover do carrinho"
      >
        🗑️
      </button>
    </div>
  );
};

export default ItemCarrinho;