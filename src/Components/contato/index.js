import React, { useState } from 'react';
import styles from './contato.module.css';
import whatsappIcon from '../../assets/imagens/whatsapp.png';
import mapaImg from '../../assets/imagens/mapa_contato.png';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarTelefone = (telefone) => {
    // Remove tudo que não é número
    const numeros = telefone.replace(/\D/g, '');
    // Valida se tem 10 ou 11 dígitos (com DDD)
    return numeros.length >= 10 && numeros.length <= 11;
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarForm = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!validarEmail(formData.email)) {
      novosErros.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (!validarTelefone(formData.telefone)) {
      novosErros.telefone = 'Enter a valid number';
    }

    if (!formData.mensagem.trim()) {
      novosErros.mensagem = 'Mensagem é obrigatória';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarForm()) {
      return;
    }

    setLoading(true);

    try {
      // Aqui você vai fazer a requisição para sua API
      const response = await fetch('http://localhost:5000/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Mensagem enviada com sucesso!');
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          mensagem: ''
        });
      } else {
        alert('Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contatoContainer}>
      <div className={styles.contatoContent}>
        {/* Lado Esquerdo - Informações */}
        <div className={styles.contatoInfo}>
          <h1>Entre em contato com a gente!</h1>
          
          <div className={styles.infoItem}>
            <p className={styles.infoLabel}>E-mail:</p>
            <p className={styles.infoTexto}>contato@sintesebio.com.br</p>
          </div>

          <div className={styles.infoItem}>
            <p className={styles.infoLabel}>Telefone:</p>
            <p className={styles.infoTexto}>+55 31 3234-0000</p>
          </div>

          <div className={styles.mapaContainer}>
            <img src={mapaImg} alt="Localização" />
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className={styles.contatoForm}>
          <a 
            href="https://wa.me/5531999999999" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <img src={whatsappIcon} alt="WhatsApp" />
          </a>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleChange}
                className={errors.nome ? styles.inputError : ''}
              />
              {errors.nome && <span className={styles.error}>{errors.nome}</span>}
            </div>

            <div className={styles.formGroup}>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com.br"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.inputError : ''}
              />
              {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <input
                type="tel"
                name="telefone"
                placeholder="(00) 0000-0000"
                value={formData.telefone}
                onChange={handleChange}
                className={errors.telefone ? styles.inputError : ''}
              />
              {errors.telefone && <span className={styles.errorNumber}>{errors.telefone}</span>}
            </div>

            <div className={styles.formGroup}>
              <textarea
                name="mensagem"
                placeholder="Mensagem"
                rows="5"
                value={formData.mensagem}
                onChange={handleChange}
                className={errors.mensagem ? styles.inputError : ''}
              />
              {errors.mensagem && <span className={styles.error}>{errors.mensagem}</span>}
            </div>

            <button 
              type="submit" 
              className={styles.btnEnviar}
              disabled={loading}
            >
              {loading ? 'ENVIANDO...' : 'ENVIAR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contato;