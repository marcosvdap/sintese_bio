import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
  const numero = '553132340000';
  const url = 'https://api.whatsapp.com/send?phone=' + numero;

  return (
    
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappBtn}
      aria-label="Fale conosco pelo WhatsApp"
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
        alt="WhatsApp"
        width={32}
        height={32}
      />
    </a>
  );
};

export default WhatsAppButton;