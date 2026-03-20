import React, { useState } from 'react';
import styles from './modalcheckout.module.css';

const ModalCheckout = ({ isOpen, onClose, carrinho }) => {
  const [formData, setFormData] = useState({
    // Dados de Faturamento
    razaoSocial: '',
    cnpjCpf: '',
    faturamento: '',
    enderecoFaturamento: '',
    emailFaturamento: '',
    telefoneFaturamento: '',

    // Dados de Entrega
    cnpjCpfEntrega: '',
    destinatario: '',
    enderecoEntrega: '',
    bairro: '',
    cep: '',
    numero: '',
    complemento: '',
    instituicao: '',
    sala: '',
    bloco: '',
    laboratorio: '',
    departamento: '',
    emailEntrega: '',
    telefoneEntrega: '',

    // Dados do Projeto
    dadosProjeto: '',

    // Plano de compra
    parcelas: '',
    dataEntrega: '',
  });

  const [mesmoEndereco, setMesmoEndereco] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatPhone = (value) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    if (v.length > 2) return `(${v.slice(0,2)}) ${v.slice(2)}`;
    if (v.length > 0) return `(${v}`;
    return v;
  };

  const formatCnpjCpf = (value) => {
    let v = value.replace(/\D/g, '');
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      v = v.slice(0, 14);
      v = v.replace(/^(\d{2})(\d)/, '$1.$2');
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    }
    return v;
  };

  const formatCep = (value) => {
    let v = value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) return `${v.slice(0,5)}-${v.slice(5)}`;
    return v;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleMesmoEndereco = (checked) => {
    setMesmoEndereco(checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        cnpjCpfEntrega: prev.cnpjCpf,
        enderecoEntrega: prev.enderecoFaturamento,
        emailEntrega: prev.emailFaturamento,
        telefoneEntrega: prev.telefoneFaturamento,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.razaoSocial.trim()) newErrors.razaoSocial = 'Campo obrigatório';
    if (!formData.cnpjCpf.trim()) newErrors.cnpjCpf = 'Campo obrigatório';
    if (!formData.enderecoFaturamento.trim()) newErrors.enderecoFaturamento = 'Campo obrigatório';
    if (!formData.emailFaturamento.trim()) newErrors.emailFaturamento = 'Campo obrigatório';
    if (!formData.telefoneFaturamento.trim()) newErrors.telefoneFaturamento = 'Campo obrigatório';
    if (!formData.destinatario.trim()) newErrors.destinatario = 'Campo obrigatório';
    if (!formData.enderecoEntrega.trim()) newErrors.enderecoEntrega = 'Campo obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Campo obrigatório';
    if (!formData.cep.trim()) newErrors.cep = 'Campo obrigatório';
    if (!formData.numero.trim()) newErrors.numero = 'Campo obrigatório';
    if (!formData.emailEntrega.trim()) newErrors.emailEntrega = 'Campo obrigatório';
    if (!formData.telefoneEntrega.trim()) newErrors.telefoneEntrega = 'Campo obrigatório';
    if (!formData.parcelas) newErrors.parcelas = 'Selecione o plano de compra';
    if (!formData.dataEntrega) newErrors.dataEntrega = 'Campo obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const dadosEnvio = {
        faturamento: {
          razaoSocial: formData.razaoSocial,
          cnpjCpf: formData.cnpjCpf,
          faturamento: formData.faturamento,
          endereco: formData.enderecoFaturamento,
          email: formData.emailFaturamento,
          telefone: formData.telefoneFaturamento,
        },
        entrega: {
          cnpjCpf: formData.cnpjCpfEntrega,
          destinatario: formData.destinatario,
          endereco: formData.enderecoEntrega,
          bairro: formData.bairro,
          cep: formData.cep,
          numero: formData.numero,
          complemento: formData.complemento,
          instituicao: formData.instituicao,
          sala: formData.sala,
          bloco: formData.bloco,
          laboratorio: formData.laboratorio,
          departamento: formData.departamento,
          email: formData.emailEntrega,
          telefone: formData.telefoneEntrega,
        },
        projeto: formData.dadosProjeto,
        parcelas: formData.parcelas,
        dataEntrega: formData.dataEntrega,
        itens: carrinho.map(item => ({
          nome: item.nome,
          empresa: item.categoria || 'N/A',
          quantidade: item.quantidade || 1,
          codigoFabricante: item.codigo_fabricante
        }))
      };

      const response = await fetch("http://201.23.76.238:5000/api/enviar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEnvio)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || `Erro HTTP: ${response.status}`);

      if (data?.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose(true);
          setShowSuccess(false);
          setFormData({
            razaoSocial: '', cnpjCpf: '', faturamento: '', enderecoFaturamento: '',
            emailFaturamento: '', telefoneFaturamento: '', cnpjCpfEntrega: '',
            destinatario: '', enderecoEntrega: '', bairro: '', cep: '', numero: '',
            complemento: '', instituicao: '', sala: '', bloco: '', laboratorio: '',
            departamento: '', emailEntrega: '', telefoneEntrega: '', dadosProjeto: '',
            parcelas: '', dataEntrega: '',
          });
        }, 3000);
      } else {
        throw new Error(data?.message || "Erro ao enviar cotação");
      }
    } catch (error) {
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
    if (e.target === e.currentTarget && !isSubmitting) onClose(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
          <h2 className={styles.title}>📋 RESUMO DO PEDIDO</h2>
          <button className={styles.closeButton} onClick={handleClose} disabled={isSubmitting}>✕</button>
        </div>

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

              <form className={styles.form} onSubmit={handleSubmit}>

                {/* ===== DADOS DE FATURAMENTO ===== */}
                <h3 className={styles.sectionTitle}>🧾 DADOS DE FATURAMENTO</h3>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Razão Social / Nome Completo<span className={styles.required}>*</span></label>
                  <input type="text" className={`${styles.input} ${errors.razaoSocial ? styles.inputError : ''}`}
                    value={formData.razaoSocial} onChange={(e) => handleChange('razaoSocial', e.target.value)}
                    placeholder="Razão social ou nome completo" disabled={isSubmitting} />
                  {errors.razaoSocial && <span className={styles.errorMessage}>{errors.razaoSocial}</span>}
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>CNPJ / CPF<span className={styles.required}>*</span></label>
                    <input type="text" className={`${styles.input} ${errors.cnpjCpf ? styles.inputError : ''}`}
                      value={formData.cnpjCpf} onChange={(e) => handleChange('cnpjCpf', formatCnpjCpf(e.target.value))}
                      placeholder="000.000.000-00" disabled={isSubmitting} maxLength={18} />
                    {errors.cnpjCpf && <span className={styles.errorMessage}>{errors.cnpjCpf}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Faturamento</label>
                    <input type="text" className={styles.input}
                      value={formData.faturamento} onChange={(e) => handleChange('faturamento', e.target.value)}
                      placeholder="Ex: Mensal, Anual..." disabled={isSubmitting} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Endereço Completo<span className={styles.required}>*</span></label>
                  <input type="text" className={`${styles.input} ${errors.enderecoFaturamento ? styles.inputError : ''}`}
                    value={formData.enderecoFaturamento} onChange={(e) => handleChange('enderecoFaturamento', e.target.value)}
                    placeholder="Rua, número, bairro, cidade..." disabled={isSubmitting} />
                  {errors.enderecoFaturamento && <span className={styles.errorMessage}>{errors.enderecoFaturamento}</span>}
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>E-mail<span className={styles.required}>*</span></label>
                    <input type="email" className={`${styles.input} ${errors.emailFaturamento ? styles.inputError : ''}`}
                      value={formData.emailFaturamento} onChange={(e) => handleChange('emailFaturamento', e.target.value)}
                      placeholder="exemplo@email.com" disabled={isSubmitting} />
                    {errors.emailFaturamento && <span className={styles.errorMessage}>{errors.emailFaturamento}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Telefone<span className={styles.required}>*</span></label>
                    <input type="tel" className={`${styles.input} ${errors.telefoneFaturamento ? styles.inputError : ''}`}
                      value={formData.telefoneFaturamento} onChange={(e) => handleChange('telefoneFaturamento', formatPhone(e.target.value))}
                      placeholder="(00) 00000-0000" maxLength={15} disabled={isSubmitting} />
                    {errors.telefoneFaturamento && <span className={styles.errorMessage}>{errors.telefoneFaturamento}</span>}
                  </div>
                </div>

                {/* ===== DADOS DO PROJETO ===== */}
                <h3 className={styles.sectionTitle}>🔬 DADOS DO PROJETO</h3>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Descrição do Projeto</label>
                  <textarea className={styles.textarea}
                    value={formData.dadosProjeto} onChange={(e) => handleChange('dadosProjeto', e.target.value)}
                    placeholder="Descreva os dados do projeto..." rows={3} disabled={isSubmitting} />
                </div>

                {/* ===== DADOS DE ENTREGA ===== */}
                <h3 className={styles.sectionTitle}>🚚 DADOS DE ENTREGA</h3>

                <div className={styles.checkboxGroup}>
                  <input type="checkbox" id="mesmoEndereco" checked={mesmoEndereco}
                    onChange={(e) => handleMesmoEndereco(e.target.checked)} disabled={isSubmitting} />
                  <label htmlFor="mesmoEndereco">Mesmo endereço de faturamento</label>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>CNPJ / CPF Destinatário</label>
                    <input type="text" className={styles.input}
                      value={formData.cnpjCpfEntrega} onChange={(e) => handleChange('cnpjCpfEntrega', formatCnpjCpf(e.target.value))}
                      placeholder="000.000.000-00" maxLength={18} disabled={isSubmitting || mesmoEndereco} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nome Destinatário<span className={styles.required}>*</span></label>
                    <input type="text" className={`${styles.input} ${errors.destinatario ? styles.inputError : ''}`}
                      value={formData.destinatario} onChange={(e) => handleChange('destinatario', e.target.value)}
                      placeholder="Nome do destinatário" disabled={isSubmitting} />
                    {errors.destinatario && <span className={styles.errorMessage}>{errors.destinatario}</span>}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Endereço de Entrega<span className={styles.required}>*</span></label>
                  <input type="text" className={`${styles.input} ${errors.enderecoEntrega ? styles.inputError : ''}`}
                    value={formData.enderecoEntrega} onChange={(e) => handleChange('enderecoEntrega', e.target.value)}
                    placeholder="Rua, Avenida..." disabled={isSubmitting || mesmoEndereco} />
                  {errors.enderecoEntrega && <span className={styles.errorMessage}>{errors.enderecoEntrega}</span>}
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Bairro<span className={styles.required}>*</span></label>
                    <input type="text" className={`${styles.input} ${errors.bairro ? styles.inputError : ''}`}
                      value={formData.bairro} onChange={(e) => handleChange('bairro', e.target.value)}
                      placeholder="Bairro" disabled={isSubmitting} />
                    {errors.bairro && <span className={styles.errorMessage}>{errors.bairro}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>CEP<span className={styles.required}>*</span></label>
                    <input type="text" className={`${styles.input} ${errors.cep ? styles.inputError : ''}`}
                      value={formData.cep} onChange={(e) => handleChange('cep', formatCep(e.target.value))}
                      placeholder="00000-000" maxLength={9} disabled={isSubmitting} />
                    {errors.cep && <span className={styles.errorMessage}>{errors.cep}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>N°<span className={styles.required}>*</span></label>
                    <input type="text" className={`${styles.input} ${errors.numero ? styles.inputError : ''}`}
                      value={formData.numero} onChange={(e) => handleChange('numero', e.target.value)}
                      placeholder="Nº" disabled={isSubmitting} />
                    {errors.numero && <span className={styles.errorMessage}>{errors.numero}</span>}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Complemento</label>
                  <input type="text" className={styles.input}
                    value={formData.complemento} onChange={(e) => handleChange('complemento', e.target.value)}
                    placeholder="Apto, bloco..." disabled={isSubmitting} />
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Instituição</label>
                    <input type="text" className={styles.input}
                      value={formData.instituicao} onChange={(e) => handleChange('instituicao', e.target.value)}
                      placeholder="Nome da instituição" disabled={isSubmitting} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Departamento</label>
                    <input type="text" className={styles.input}
                      value={formData.departamento} onChange={(e) => handleChange('departamento', e.target.value)}
                      placeholder="Departamento" disabled={isSubmitting} />
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Sala</label>
                    <input type="text" className={styles.input}
                      value={formData.sala} onChange={(e) => handleChange('sala', e.target.value)}
                      placeholder="Sala" disabled={isSubmitting} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Bloco</label>
                    <input type="text" className={styles.input}
                      value={formData.bloco} onChange={(e) => handleChange('bloco', e.target.value)}
                      placeholder="Bloco" disabled={isSubmitting} />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Laboratório</label>
                    <input type="text" className={styles.input}
                      value={formData.laboratorio} onChange={(e) => handleChange('laboratorio', e.target.value)}
                      placeholder="Laboratório" disabled={isSubmitting} />
                  </div>
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>E-mail<span className={styles.required}>*</span></label>
                    <input type="email" className={`${styles.input} ${errors.emailEntrega ? styles.inputError : ''}`}
                      value={formData.emailEntrega} onChange={(e) => handleChange('emailEntrega', e.target.value)}
                      placeholder="exemplo@email.com" disabled={isSubmitting || mesmoEndereco} />
                    {errors.emailEntrega && <span className={styles.errorMessage}>{errors.emailEntrega}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Telefone / Celular<span className={styles.required}>*</span></label>
                    <input type="tel" className={`${styles.input} ${errors.telefoneEntrega ? styles.inputError : ''}`}
                      value={formData.telefoneEntrega} onChange={(e) => handleChange('telefoneEntrega', formatPhone(e.target.value))}
                      placeholder="(00) 00000-0000" maxLength={15} disabled={isSubmitting || mesmoEndereco} />
                    {errors.telefoneEntrega && <span className={styles.errorMessage}>{errors.telefoneEntrega}</span>}
                  </div>
                </div>

                {/* ===== PLANO DE COMPRA ===== */}
                <h3 className={styles.sectionTitle}>💳 PLANO DE COMPRA</h3>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Planejamento da Compra<span className={styles.required}>*</span></label>
                    <select className={`${styles.input} ${errors.parcelas ? styles.inputError : ''}`}
                      value={formData.parcelas} onChange={(e) => handleChange('parcelas', e.target.value)}
                      disabled={isSubmitting}>
                      <option value="">Selecione</option>
                      <option value="avista">À Vista</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num}x {num === 1 ? 'Mês' : 'Meses'}</option>
                      ))}
                    </select>
                    {errors.parcelas && <span className={styles.errorMessage}>{errors.parcelas}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Data de Entrega<span className={styles.required}>*</span></label>
                    <input type="date" className={`${styles.input} ${errors.dataEntrega ? styles.inputError : ''}`}
                      value={formData.dataEntrega} onChange={(e) => handleChange('dataEntrega', e.target.value)}
                      disabled={isSubmitting} />
                    {errors.dataEntrega && <span className={styles.errorMessage}>{errors.dataEntrega}</span>}
                  </div>
                </div>

                {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? <>⏳ Enviando...</> : <>✅ Confirmar Pedido</>}
                </button>

              </form>
            </>
          ) : (
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className={styles.successTitle}>Pedido Enviado com Sucesso!</h2>
              <p className={styles.successMessage}>Obrigado, <strong>{formData.razaoSocial}</strong>!</p>
              <p className={styles.successMessage}>Nossa equipe entrará em contato em breve.</p>
              <div className={styles.successEmail}>📧 Confirmação enviada para: {formData.emailFaturamento}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCheckout;