import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useCarrinho } from 'Components/carrinhocontext';
import ItemCarrinho from 'Components/itemcarrinho';
import styles from './carrinho.module.css';
import Cabecalhocat from 'Components/Cabecalhocat';
import Rodape from 'Components/Rodape';
import ModalCheckout from "Components/modalcheckout";

const Carrinho = () => {
    const { itens, quantidadeTotal, limparCarrinho } = useCarrinho();
    const [modalCheckoutAberto, setModalCheckoutAberto] = useState(false);

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      const preco = item.preco || 0;
      const quantidade = item.quantidade || 1;
      return total + (preco * quantidade);
    }, 0);
  };

  const total = calcularTotal();

  const handleFazerCotacao = () => {
    if (itens.length === 0) {
      alert('Adicione produtos ao carrinho antes de fazer a cotação');
      return;
    }
    setModalCheckoutAberto(true);
  };

  const handleFecharModal = (pedidoConfirmado) => {
    setModalCheckoutAberto(false);
    
    if (pedidoConfirmado) {
      limparCarrinho();
    }
  };

    const handleLimparCarrinho = () => {
        if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
            limparCarrinho();
        }
    };

    return (
        <>
            <Cabecalhocat />
            
            {/* Header fora do container */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.iconCarrinho}>🛒</div>
                    <h1>PRODUTOS DO CARRINHO</h1>
                    <Link to="/catalogo">
                        <button className={styles.btnVoltarCatalogo}>
                            VOLTAR PARA O CATÁLOGO
                        </button>
                    </Link>
                </div>
            </div>

            {/* Container com conteúdo */}
            <div className={styles.container}>
                <div className={styles.conteudo}>
                    {itens.length === 0 ? (
                        <div className={styles.carrinhoVazio}>
                            <div className={styles.iconeVazio}>🛒</div>
                            <h2>Seu carrinho está vazio</h2>
                            <p>Adicione produtos para fazer uma cotação</p>
                            <button
                                className={styles.btnVoltar}
                                onClick={() => window.history.back()}
                            >
                                VOLTAR PARA PRODUTOS
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={styles.listaItens}>
                                {itens.map(item => (
                                    <ItemCarrinho key={item.id} item={item} />
                                ))}
                            </div>

                            <div className={styles.rodape}>
                                <div className={styles.rodapeInfo}>
                                    <span className={styles.quantidadeTotal}>
                                        QUANTIDADE: {quantidadeTotal} ITENS
                                    </span>
                                </div>
                                <div className={styles.rodapeBotoes}>
                                    <button
                                        className={styles.btnFazerCotacao}
                                        onClick={handleFazerCotacao}
                                    >
                                        FAZER COTAÇÃO
                                    </button>
                                    <button
                                        className={styles.btnLimpar}
                                        onClick={handleLimparCarrinho}
                                    >
                                        LIMPAR CARRINHO
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    <ModalCheckout
                        isOpen={modalCheckoutAberto}
                        onClose={handleFecharModal}
                        carrinho={itens}
                        total={total}
                    />
                </div>
            </div>
            
            <Rodape />
        </>
    );
};

export default Carrinho;