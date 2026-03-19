import { useState } from 'react';
import styles from './marcas.module.css';

import idtLogo from '../../assets/imagens/IDT.png';
import himediaLogo from '../../assets/imagens/HIMEDIA.png';
import biotechrabbitLogo from '../../assets/imagens/BIOTECH.png';
import biorad from '../../assets/imagens/BIORAD.png';

const Marcas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Agora cada marca tem imagem + url
  const marcas = [
    { logo: idtLogo,            url: 'https://www.idtdna.com' },
    { logo: himediaLogo,        url: 'https://www.himedialabs.com' },
    { logo: biotechrabbitLogo,  url: 'https://www.biotechrabbit.com' },
    { logo: biorad,             url: 'https://www.bio-rad.com' },
  ];

  const nextSlide = () => {
    if (currentIndex < marcas.length - 3) setCurrentIndex(currentIndex + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <section className={styles.marcasSection}>
      <div className={styles.marcasHeader}>
        <h2>PRINCIPAIS MARCAS</h2>
      </div>

      <div className={styles.carouselContainer}>
        <button 
          className={styles.btnPrev}
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          &lt;
        </button>

        <div className={styles.marcasWrapper}>
          {marcas.slice(currentIndex, currentIndex + 3).map((marca, index) => (
            <div key={index} className={styles.marcaItem}>
              {/* Envolve a imagem com um link */}
              <a href={marca.url} target="_blank" rel="noopener noreferrer">
                <img src={marca.logo} alt={`Marca ${index + 1}`} />
              </a>
            </div>
          ))}
        </div>

        <button 
          className={styles.btnNext}
          onClick={nextSlide}
          disabled={currentIndex >= marcas.length - 3}
        >
          &gt;
        </button>
      </div>
      <div className={styles.divider}></div>
    </section>
  );
};

export default Marcas;