import React, { useState } from 'react';
import styles from './denuncia.module.css';

const Denuncia = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        mensagem: ''
    });
    const [loading, setLoading] = useState(false);
    const [mensagemStatus, setMensagemStatus] = useState({ tipo: '', texto: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação - apenas mensagem é obrigatória
        if (!formData.mensagem.trim()) {
            setMensagemStatus({
                tipo: 'erro',
                texto: 'Por favor, descreva sua denúncia.'
            });
            return;
        }

        setLoading(true);
        setMensagemStatus({ tipo: '', texto: '' });

        try {
            const response = await fetch('http://localhost:5000/api/denuncia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setMensagemStatus({
                    tipo: 'sucesso',
                    texto: 'Denúncia enviada com sucesso! Obrigado por nos alertar.'
                });
                // Limpar formulário
                setFormData({
                    nome: '',
                    email: '',
                    mensagem: ''
                });
            } else {
                setMensagemStatus({
                    tipo: 'erro',
                    texto: data.message || 'Erro ao enviar denúncia. Tente novamente.'
                });
            }
        } catch (error) {
            console.error('Erro ao enviar denúncia:', error);
            setMensagemStatus({
                tipo: 'erro',
                texto: 'Erro ao enviar denúncia. Verifique sua conexão e tente novamente.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>CANAL DE DENÚNCIAS</h1>
            </div>

            <div className={styles.conteudo}>
                <div className={styles.textoIntroducao}>
                    <p>
                        Na <strong>Síntese Biotecnologia</strong>, valorizamos a <strong>integridade</strong> e o <strong>respeito em todas as nossas relações</strong>.
                    </p>
                    <p>
                        Este canal foi criado para que você possa <strong>relatar, com segurança e confidencialidade, qualquer conduta que viole nosso Código de Conduta</strong> ou a legislação vigente. Seja uma suspeita, um comportamento inadequado ou uma situação que tenha presenciado, <strong>sua denúncia será acolhida com seriedade e protegida por total sigilo</strong>.
                    </p>
                </div>

                <form className={styles.formulario} onSubmit={handleSubmit}>
                    <div className={styles.campoWrapper}>
                        <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Nome completo (opcional)"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.campoWrapper}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e-mail (opcional)"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.campoWrapper}>
                        <textarea
                            name="mensagem"
                            value={formData.mensagem}
                            onChange={handleChange}
                            placeholder="Mensagem"
                            className={styles.textarea}
                            rows="6"
                            required
                        />
                    </div>

                    {mensagemStatus.texto && (
                        <div className={`${styles.mensagemStatus} ${styles[mensagemStatus.tipo]}`}>
                            {mensagemStatus.texto}
                        </div>
                    )}

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
    );
};

export default Denuncia;