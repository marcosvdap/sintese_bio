import { useState, useEffect } from 'react';
import styles from "./evento.module.css";
import event from '../../assets/imagens/eventos.png';

const Evento = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://201.23.76.238:5000/api/eventos')
      .then(res => res.json())
      .then(data => {
        setEventos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar eventos:', err);
        setLoading(false);
      });
  }, []);

  // Formatar data para exibição
  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.eventoContainer}>
      <header className={styles.eventoheader}>
        <div className={styles.eventoTexto}>
          <h2>Síntese Biotecnologia</h2>
          <p>
            A Síntese Biotecnologia foi fundada em 2011 em Belo Horizonte, Minas Gerais,
            com o objetivo de oferecer produtos e soluções para pesquisadores e laboratórios
            das mais diversas áreas, desde pesquisa básica em ciências da vida até insumos
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
        <div className={styles.eventoImagem}>
          <img src={event} alt="Equipe Síntese Biotecnologia" />
        </div>
      </header>
      <div className={styles.eventoheader2}>
        <h2>PROXIMOS EVENTOS</h2> 
      </div>
      <section className={styles.eventosSection}>

        {loading ? (
          <div className={styles.loading}>Carregando eventos...</div>
        ) : eventos.length === 0 ? (
          <div className={styles.semEventos}>Nenhum evento disponível no momento.</div>
        ) : (
          <div className={styles.eventosLista}>
            {eventos.map(evento => (
              <div key={evento.id} className={styles.eventoCard}>
                <div className={styles.eventoData}>
                  <span className={styles.dataInicio}>{formatarData(evento.data_inicio)}</span>
                  {evento.data_inicio !== evento.data_fim && (
                    <>
                      <span className={styles.dataSeparador}>até</span>
                      <span className={styles.dataFim}>{formatarData(evento.data_fim)}</span>
                    </>
                  )}
                </div>
                <h3 className={styles.eventoTitulo}>{evento.titulo}</h3>
                {evento.link && (
                  <a
                    href={evento.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.eventoLink}
                  >
                    Saiba mais →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Evento;