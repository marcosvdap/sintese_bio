import React from "react";
import styles from "./sobre.module.css";
import group from '../../assets/imagens/group.png';
import mapa from '../../assets/imagens/mapa.png';

const Sobre = () => {
  return (
    <div className={styles.sobreContainer}>
      <header className={styles.sobreHeader}>
        <div className={styles.sobreTexto}>
          <h1>Síntese Biotecnologia</h1>
          <p>
            A Síntese Biotecnologia foi fundada em 2011 em Belo Horizonte, Minas Gerais, 
            com o objetivo de oferecer produtos e soluções para pesquisadores e laboratórios 
            das mais diversas áreas,desde pesquisa básica em ciências da vida até insumos 
            para diagnóstico e indústria.

          </p>
          <p>
            Com atuação em todo o território nacional, a Síntese se tornou conhecida por 
            estabelecer diversas parcerias prósperas com empresas de alto padrão no ramo da 
            ciência mundial. Ao longo de mais de 13 anos de experiência, a empresa 
            belo-horizontina busca empoderar e auxiliar cientistas brasileiros a elevar a 
            ciência brasileira a novos patamares.
          </p>
        </div>
        <div className={styles.sobreImagem}>
          <img src={group} alt="Equipe Síntese Biotecnologia" />
        </div>
      </header>

      <section className={styles.cardsSection}>
        <div className={styles.cardsContainer}>
          <div className={styles.card}>
            <h2>MISSÃO</h2>
            <p>
              Facilitar o acesso dos pesquisadores a reagentes de alta qualidade, 
              desenvolvendo soluções inovadoras que atendam às necessidades do mercado 
              de ciência e biotecnologia.
            </p>
          </div>

          <div className={styles.card}>
            <h2>VISÃO</h2>
            <p>
              Ser reconhecida no mercado como referência mundial em soluções científicas, 
              desenvolvendo produtos de alta qualidade e inovação para o mercado de pesquisa.
            </p>
          </div>

          <div className={styles.card}>
            <h2>VALORES</h2>
            <p>
              Qualidade, excelência, responsabilidade e inovação são os pilares que guiam 
              todas as nossas ações e decisões.
            </p>
          </div>
        </div>
      </section>
      <div className={styles.sobreheader2}>
        <h2>CONHEÇA NOSSOS ESCRITORIOS</h2> 
      </div>
      <div className={styles.mapaContainer}>  
        <div className={styles.sobremapa}>
          <img src={mapa} alt="Equipe Síntese Biotecnologia"/>
        </div>
      </div>  
    </div>
  );
};

export default Sobre;