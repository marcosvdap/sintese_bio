import React, { createContext, useContext, useState, useEffect } from 'react';

const CarrinhoContext = createContext();

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
};

export const CarrinhoProvider = ({ children }) => {
  const [itens, setItens] = useState([]);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      setItens(JSON.parse(carrinhoSalvo));
    }
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    setItens(prevItens => {
      const itemExistente = prevItens.find(item => item.id === produto.id);
      
      if (itemExistente) {
        return prevItens.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      } else {
        return [...prevItens, { ...produto, quantidade: 1 }];
      }
    });
  };

  // Remover produto do carrinho
  const removerDoCarrinho = (produtoId) => {
    setItens(prevItens => prevItens.filter(item => item.id !== produtoId));
  };

  // Atualizar quantidade de um produto
  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }

    setItens(prevItens =>
      prevItens.map(item =>
        item.id === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
      )
    );
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setItens([]);
  };

  // Calcular quantidade total de itens
  const quantidadeTotal = itens.reduce((total, item) => total + item.quantidade, 0);

  // Calcular valor total (se houver preço nos produtos)
  const valorTotal = itens.reduce((total, item) => {
    const preco = item.preco || 0;
    return total + (preco * item.quantidade);
  }, 0);

  const value = {
    itens,
    adicionarAoCarrinho,
    removerDoCarrinho,
    atualizarQuantidade,
    limparCarrinho,
    quantidadeTotal,
    valorTotal
  };

  return (
    <CarrinhoContext.Provider value={value}>
      {children}
    </CarrinhoContext.Provider>
  );
};






