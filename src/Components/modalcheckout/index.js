// src/Components/catalogo/ModalCheckout/index.jsx
import React, { useState } from 'react';
import styles from './modalcheckout.module.css';

const ModalCheckout = ({ isOpen, onClose, carrinho }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    instituicao: '',
    telefone: '',
    dataEntrega: '',
    parcelas: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validação dos campos
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.dataEntrega) {
      newErrors.dataEntrega = 'Data de entrega é obrigatória';
    }
    const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/;
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!phoneRegex.test(formData.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!formData.parcelas) {
      newErrors.parcelas = 'Selecione o plano de compra';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatar telefone
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length > 0) {
        value = `(${value}`;
      }
    }
    setFormData({ ...formData, telefone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dadosEnvio = {
        nome: formData.nome,
        email: formData.email,
        instituicao: formData.instituicao,
        telefone: formData.telefone,
        dataEntrega: formData.dataEntrega,
        parcelas: formData.parcelas,
        itens: carrinho.map(item => ({
          nome: item.nome,
          empresa: item.categoria || 'N/A',
          quantidade: item.quantidade || 1,
          codigoFabricante: item.codigo_fabricante
        }))
      };

      console.log("📤 Enviando cotação:", dadosEnvio);

      const response = await fetch("http://201.23.76.238:5000/api/enviar-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosEnvio)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Erro HTTP: ${response.status}`);
      }

      if (data?.success) {
        console.log("✅ Cotação enviada com sucesso!");
        setShowSuccess(true);

        setTimeout(() => {
          onClose(true);
          setShowSuccess(false);
          setFormData({
            nome: '',
            email: '',
            telefone: '',
            dataEntrega: '',
            parcelas: ''
          });
        }, 3000);
      } else {
        throw new Error(data?.message || "Erro ao enviar cotação");
      }

    } catch (error) {
      console.error("❌ Erro:", error);

      let mensagemErro = "Erro ao processar pedido. ";

      if (error.message.includes("Failed to fetch")) {
        mensagemErro += "Servidor não está respondendo.";
      } else {
        mensagemErro += error.message;
      }

      alert(mensagemErro);
      setErrors({ submit: mensagemErro });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        nome: '',
        email: '',
        instituicao: '',
        telefone: '',
        dataEntrega: '',
        parcelas: ''
      });
      setErrors({});
      setShowSuccess(false);
      onClose(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            📋 RESUMO DO PEDIDO
          </h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {!showSuccess ? (
            <>
              {/* Tabela de Produtos */}
              <div className={styles.summary}>
                <div className={styles.summaryProdutos}>
                  <table>
                    <thead>
                      <tr>
                        <th>PRODUTO</th>
                        <th>EMPRESA</th>
                        <th>QUANTIDADE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrinho.map((item, index) => (
                        <tr key={index}>
                          <td className={styles.produtoNome}>{item.nome}</td>
                          <td className={styles.produtoEmpresa}>{item.categoria || 'BiotechRabbit'}</td>
                          <td>
                            <div className={styles.produtoQtd}>
                              <span>{item.quantidade || 1}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Formulário */}
              <form className={styles.form} onSubmit={handleSubmit}>
                <h3 className={styles.formTitle}>
                  👤 DADOS DA ENTREGA
                </h3>

                {/* Nome Completo */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Nome Completo<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.nome ? styles.inputError : ''}`}
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Digite seu nome completo..."
                    disabled={isSubmitting}
                  />
                  {errors.nome && (
                    <span className={styles.errorMessage}>{errors.nome}</span>
                  )}
                </div>

                {/* E-mail */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    E-mail<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemplo@email.com"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span className={styles.errorMessage}>{errors.email}</span>
                  )}
                </div>

                {/* Telefone/WhatsApp */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Telefone/ WhatsApp<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    className={`${styles.input} ${errors.telefone ? styles.inputError : ''}`}
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    maxLength="15"
                    disabled={isSubmitting}
                  />
                  {errors.telefone && (
                    <span className={styles.errorMessage}>{errors.telefone}</span>
                  )}
                </div>
                {/* Instituição */} 
                 <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Instituição<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.instituicao ? styles.inputError : ''}`}
                    value={formData.instituicao}
                    onChange={(e) => setFormData({ ...formData, instituicao: e.target.value })}
                    placeholder="Digite sua instituição..."
                    disabled={isSubmitting}
                  />
                  {errors.instituicao && (
                    <span className={styles.errorMessage}>{errors.instituicao}</span>
                  )}
                </div>

                {/* Data da Entrega */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Data da Entrega<span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    className={`${styles.input} ${errors.dataEntrega ? styles.inputError : ''}`}
                    value={formData.dataEntrega}
                    onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                    placeholder="dd/mm/aaaa"
                    disabled={isSubmitting}
                  />
                  {errors.dataEntrega && (
                    <span className={styles.errorMessage}>{errors.dataEntrega}</span>
                  )}
                </div>

                {/* Planeamento da Compra */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    Planeamento da Compra<span className={styles.required}>*</span>
                  </label>
                  <select
                    className={`${styles.input} ${errors.parcelas ? styles.inputError : ''}`}
                    value={formData.parcelas}
                    onChange={(e) => setFormData({ ...formData, parcelas: e.target.value })}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecione</option>
                    <option value="avista">À Vista</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}x {num === 1 ? 'Mês' : 'Meses'}
                      </option>
                    ))}
                  </select>
                  {errors.parcelas && (
                    <span className={styles.errorMessage}>{errors.parcelas}</span>
                  )}
                </div>

                {/* Erro geral */}
                {errors.submit && (
                  <div className={styles.submitError}>
                    {errors.submit}
                  </div>
                )}

                {/* Botão Submit */}
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>⏳ Enviando...</>
                  ) : (
                    <>✅ Confirmar Pedido</>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Mensagem de Sucesso */
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className={styles.successTitle}>
                Pedido Enviado com Sucesso!
              </h2>

              <p className={styles.successMessage}>
                Obrigado, <strong>{formData.nome}</strong>!
              </p>

              <p className={styles.successMessage}>
                Nossa equipe entrará em contato em breve.
              </p>

              <div className={styles.successEmail}>
                📧 Confirmação enviada para: {formData.email}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCheckout;