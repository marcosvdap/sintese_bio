import React, { useState } from 'react';
import styles from './contato.module.css';
// import mapaImg from '../../assets/imagens/mapa_contato.png'; // <- Remova ou comente esta linha

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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarTelefone = (telefone) => {
    const numeros = telefone.replace(/\D/g, '');
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
      const response = await fetch('http://201.23.76.238:5000/api/contato', {
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

          {/* MAPA DO GOOGLE AQUI */}
{/* MAPA DO GOOGLE AQUI */}
          <div className={styles.mapaContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4616.425796048703!2d-43.96940322388624!3d-19.892272737136587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6905e898c0001%3A0xd441ff3716b9a8e4!2sS%C3%ADntese%20Biotecnologia!5e1!3m2!1spt-BR!2sbr!4v1775005931328!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Localização"
            ></iframe>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className={styles.contatoForm}>
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