import React from 'react';
import styles from './Cookiesp.module.css'; // Importando o CSS renomeado

function Cookiesp() {
    return (
        <section className={styles.cookiesContainer}>
            
            {/* Header Azul */}
            <div className={styles.headerFaixa}>
                <h1>Política de Cookies</h1>
            </div>

            {/* Documento Branco */}
            <div className={styles.conteudoDocumento}>
                
                <p className={styles.dataAtualizacao}>
                    Esta Política de Cookies foi atualizada pela última vez em 21 de maio de 2024 e se aplica a cidadãos e residentes legais permanentes do Brasil.
                </p>

                {/* 1. Introdução */}
                <span className={styles.topicoTitulo}>1. Introdução</span>
                <p>
                    Nosso site, <a href="https://mediumvioletred-tiger-755193.hostingersite.com" className={styles.linkTexto} target="_blank" rel="noreferrer">https://mediumvioletred-tiger-755193.hostingersite.com</a> (doravante: "o site") usa cookies e outras tecnologias relacionadas (por conveniência todas as tecnologias são referidas como "cookies"). Os cookies também são inseridos por terceiros que contratamos. No documento abaixo informamos sobre o uso de cookies em nosso site.
                </p>

                {/* 2. O que são cookies? */}
                <span className={styles.topicoTitulo}>2. O que são cookies?</span>
                <p>
                    Um cookie é um arquivo pequeno e simples que é enviado junto com páginas deste site e armazenado pelo seu navegador no disco rígido do seu computador ou outro dispositivo. As informações armazenadas podem ser enviadas de volta aos nossos servidores ou aos servidores dos terceiros relevantes durante uma visita subsequente.
                </p>

                {/* 3. O que são scripts? */}
                <span className={styles.topicoTitulo}>3. O que são scripts?</span>
                <p>
                    Um script é uma parte de código de programa usado para fazer nosso site funcionar de forma adequada e interativa. Este código é executado em nosso servidor ou em seu dispositivo.
                </p>

                {/* 4. O que é um web beacon? */}
                <span className={styles.topicoTitulo}>4. O que é um web beacon?</span>
                <p>
                    Um web beacon (ou uma tag pixel) é um pequena e invisível texto ou imagem em um site que é usado para monitorar o tráfego em um site. Para fazer isso, vários dados sobre você são armazenados usando web beacons.
                </p>

                {/* 5. Cookies */}
                <span className={styles.topicoTitulo}>5. Cookies</span>

                <span className={styles.subTopico}>5.1 Cookies técnicos ou funcionais</span>
                <p>
                    Alguns cookies garantem que certas partes do site funcionem corretamente e que suas preferências de usuário permaneçam conhecidas. Ao inserir cookies funcionais, facilitamos a visita ao nosso site. Dessa forma, você não precisa inserir repetidamente as mesmas informações ao visitar nosso site e, por exemplo, os itens permanecem em seu carrinho de compras até que você tenha concluído a compra. Podemos inserir esses cookies sem o seu consentimento.
                </p>

                <span className={styles.subTopico}>5.2 Cookies analíticos</span>
                <p>
                    Usamos cookies analíticos para otimizar a experiência do site para nossos usuários. Com estes cookies analíticos, obtemos informações sobre o uso de nosso site. Pedimos sua permissão para inserir cookies analíticos.
                </p>

                <span className={styles.subTopico}>5.3 Cookies de publicidade</span>
                <p>
                    Neste site usamos cookies de publicidade, que fornecem informações sobre os resultados de campanhas. Isso é feito com base em um perfil do seu comportamento em <span className={styles.linkTexto}>https://mediumvioletred-tiger-755193.hostingersite.com</span>. Com estes cookies você, como visitante do site, está vinculado a um ID exclusivo, mas esses cookies não serão usados para veicular anúncios personalizados com base no seu comportamento e interesse.
                </p>

                <span className={styles.subTopico}>5.4 Cookies de marketing/rastreamento</span>
                <p>
                    Cookies de marketing/rastreamento são como qualquer outro tipo de cookie ou forma de armazenamento local, usados para criar perfis de usuários para exibir publicidade ou para rastrear o usuário neste site ou em vários sites para fins de marketing.
                </p>
                <p>
                    Como esses cookies são marcados como cookies de rastreamento, pedimos sua permissão para inseri-los.
                </p>

                <span className={styles.subTopico}>5.5 Mídia social</span>
                <p>
                    Em nosso site, incluímos conteúdo de Instagram, Facebook, LinkedIn e WhatsApp para promover páginas da web (por exemplo, "curtir", "pin") ou compartilhar (por exemplo, "twittar") em redes sociais como Instagram, Facebook, LinkedIn e WhatsApp. Este conteúdo é incorporado com código derivado de Instagram, Facebook, LinkedIn e WhatsApp e coloca cookies. Esse conteúdo pode armazenar e processar determinadas informações para publicidade personalizada.
                </p>
                <p>
                    Leia a declaração de privacidade dessas redes sociais (que podem mudar regularmente) para saber o que eles fazem com seus dados (pessoais) que eles processam usando esses cookies. Os dados recuperados são anonimizados tanto quanto possível. Instagram, Facebook, LinkedIn e WhatsApp estão localizados nos Estados Unidos.
                </p>

            </div>

            {/* Botão WhatsApp */}
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

export default Cookiesp;