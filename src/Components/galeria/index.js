import { useState } from 'react';
import styles from './galeria.module.css';

// Importe suas 6 fotos aqui
import foto1 from '../../assets/galeria/foto1.png';
import foto2 from '../../assets/galeria/foto2.png';
import foto3 from '../../assets/galeria/foto3.png';
import foto4 from '../../assets/galeria/foto4.png';
import foto5 from '../../assets/galeria/foto5.png';
import foto6 from '../../assets/galeria/foto6.png';

const Galeria = () => {
  const [fotoAberta, setFotoAberta] = useState(null);

  const fotos = [
    { id: 1, src: foto1, alt: 'Evento 1' },
    { id: 2, src: foto2, alt: 'Evento 2' },
    { id: 3, src: foto3, alt: 'Evento 3' },
    { id: 4, src: foto4, alt: 'Evento 4' },
    { id: 5, src: foto5, alt: 'Evento 5' },
    { id: 6, src: foto6, alt: 'Evento 6' },
  ];

  const abrirFoto = (foto) => {
    setFotoAberta(foto);
  };

  const fecharFoto = () => {
    setFotoAberta(null);
  };

  return (
     <><div className={styles.galeriaheader2}>
          <h2 className={styles.galeriaTitulo}>GALERIA DE FOTOS</h2>
      </div><section className={styles.galeriaSection}>

              <div className={styles.galeriaGrid}>
                  {fotos.map(foto => (
                      <div
                          key={foto.id}
                          className={styles.galeriaItem}
                          onClick={() => abrirFoto(foto)}
                      >
                          <img src={foto.src} alt={foto.alt} />
                      </div>
                  ))}
              </div>

              {fotoAberta && (
                  <div className={styles.modal} onClick={fecharFoto}>
                      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                          <button className={styles.btnFechar} onClick={fecharFoto}>
                              ✕
                          </button>
                          <img src={fotoAberta.src} alt={fotoAberta.alt} />
                      </div>
                  </div>
              )}
          </section></>
  );
};

export default Galeria;