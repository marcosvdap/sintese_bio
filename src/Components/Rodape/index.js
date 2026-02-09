import styles from './rodape.module.css';

// Importe suas imagens aqui
import logoSintese from '../../assets/imagens/SINTESE_MARCA-10 1.png'
import iconInstagram from '../../assets/imagens/Instagram.png';
import iconFacebook from '../../assets/imagens/Facebook.png';
import iconLinkedin from '../../assets/imagens/Linkedin.png';
import iconYoutube from '../../assets/imagens/Youtube.png';

function Rodape() {
  return (
    <footer className={styles.rodape}>
      <div className={styles.rodapeContent}>
        {/* Coluna 1 - Logo e Info */}
        <div className={styles.rodapeColuna}>
          <img src={logoSintese} alt="Síntese" className={styles.logo} />
          <p className={styles.copyright}>© 2025 - SÍNTESE BIOTECNOLOGIA LTDA</p>
          <p className={styles.cnpj}>CNPJ 13.545.241/0001-68</p>
          <div className={styles.links}>
            <a href="/privacidade">Política de Privacidade</a>
            <span>|</span>
            <a href="/cookies">Política de Cookies</a>
          </div>
        </div>

        {/* Coluna 2 - Contato */}
        <div className={styles.rodapeColuna}>
          <h3>FALE COM A GENTE</h3>
          <p>+55 31 3234-0000</p>
          <a href="mailto:CONTATO@SINTESEBIO.COM.BR">CONTATO@SINTESEBIO.COM.BR</a>

          <a href="/denuncia" className={styles.linkDenuncia}>CANAL DE DENÚNCIAS</a>
        </div>

        {/* Coluna 3 - Redes Sociais */}
        <div className={styles.rodapeColuna}>
          <h3>NOS SIGA NAS REDES SOCIAIS</h3>
          <div className={styles.redesSociais}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={iconInstagram} alt="Instagram" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={iconFacebook} alt="Facebook" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={iconLinkedin} alt="LinkedIn" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src={iconYoutube} alt="YouTube" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Rodape;