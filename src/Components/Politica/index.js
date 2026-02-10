import React from 'react';
import styles from './Politica.module.css';

function Politica() {
    return (
        <section className={styles.politicaContainer}>
            
            {/* --- FAIXA DO HEADER --- */}
            <div className={styles.headerFaixa}>
                <h1>Política de Privacidade</h1>
            </div>

            {/* --- DOCUMENTO BRANCO --- */}
            <div className={styles.conteudoDocumento}>
                
                <p>
                    <span className={styles.linkTexto}>A Política de Privacidade ao Usuário da Síntese</span> foi criada com o objetivo de mostrar o nosso compromisso em tratar os seus dados pessoais com segurança, privacidade e transparência.
                </p>
                <p>
                    Esta Política de Privacidade descreve quais são os dados pessoais coletados, como são utilizados, armazenados e compartilhados e os seus direitos em relação a esses dados. Recomendamos que você faça uma leitura atenta.
                </p>

                {/* Tópico 1 */}
                <span className={styles.topicoTitulo}>1 . Abrangência</span>
                
                <p>
                    Esta Política de Privacidade é aplicável a todas as pessoas e entidades que tem o seu cadastro (dados pessoais) em quaisquer Sistemas da Síntese.
                </p>
                <p>
                    Esta política descreve como nós, na qualidade de controladores ou operadores tratamos os seus dados.
                </p>
                <p>
                    Na qualidade de controlador, nós coletamos os seus dados pessoais quando você (i) se cadastra em nossos sistemas ou (ii) quando te cadastramos, ambos em uma relação direta com a Síntese.
                </p>
                <p>
                    Nós também coletamos os seus dados pessoais sempre que você deseja iniciar um relacionamento profissional com a Síntese ou quando uma empresa lhe cadastra como seu representante/usuário.
                </p>
                
                <p>Podemos tratar seus dados, assim, sempre que:</p>
                
                <ul className={styles.lista}>
                    <li>Cadastrar seus dados para um relacionamento comercial;</li>
                    <li>Armazenar e processar seus dados dentro de nossos sistemas on line (SaaS);</li>
                    <li>Compartilhar seus dados com fornecedores, a requerimento seu, em um processo de compra;</li>
                    <li>Guardá-los até o fim do período do tratamento dos dados (período de guarda legal das informações de tratamento e de uso);</li>
                </ul>

                <p>
                    As práticas descritas nesta Política de Privacidade se aplicam ao tratamento dos seus dados pessoais no Brasil e estão sujeitas às leis locais aplicáveis – LGPD – Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
                </p>

                {/* Tópico 2 */}
                <span className={styles.topicoTitulo}>2 . Dados pessoais coletados pelos Sistemas da Síntese</span>

                <p>
                    Ao se cadastrar e utilizar os Sistemas da Síntese você (ou um cliente nosso) fornece os seus dados pessoais para que seja possível a realização das atividades empresariais. No caso das Empresas que utilizam o cadastro dos seus funcionários, estas informações também recebem os mesmos tratamentos de dados pessoais.
                </p>
                <p>
                    A partir do momento em que você – na qualidade de representante legal ou usuário de nossos serviços – aceita os termos desta Política de Privacidade, você concorda expressamente em fornecer apenas dados pessoais verdadeiros, atualizados e corretos e em não alterar a identidade ou dados pessoais de qualquer forma no acesso e na utilização dos nossos serviços.
                </p>

            </div>

            {/* Ícone flutuante do WhatsApp */}
            <a 
                href="https://wa.me/SEUNUMERO" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.botaoWhats}
            >
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                    alt="WhatsApp" 
                />
            </a>

        </section>
    );
}

export default Politica;