import { Link, useLocation } from "react-router-dom"; // Importamos o useLocation
import React, { useState } from "react";
import logo from '../../assets/imagens/SINTESE_MARCA-1.png';
import styles from './cabecalho.module.css';
import Cabecalholink from "Components/Cabecalholink";
import Botao from "Components/botao";
import { FaBars, FaTimes } from "react-icons/fa";

function Cabecalho() {
    const [menuAberto, setMenuAberto] = useState(false);
    
    // Inicializamos o hook para pegar a rota atual
    const location = useLocation(); 

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
    };

    // Função auxiliar que retorna a classe 'ativo' se o caminho bater com a URL atual
    const classeAtiva = (caminho) => {
        return location.pathname === caminho ? styles.ativo : "";
    };

    return (
        <header className={styles.cabecalho}>
            <Link to="/">
                <img src={logo} alt="sintese" />
            </Link>
            
            <button className={styles.menuToggle} onClick={toggleMenu}>
                {menuAberto ? <FaTimes /> : <FaBars />}
            </button>

            <nav className={`${styles.nav} ${menuAberto ? styles.aberto : ""}`}>
                {/* Aplicamos a verificação em uma div ou span ao redor do item */}
                <div className={classeAtiva("/")}>
                    <Botao tipo="primario">
                        <Cabecalholink URL="/">Home</Cabecalholink>
                    </Botao>
                </div>
                
                <div className={styles.divisor}></div>
                
                <div className={classeAtiva("/sobre")}>
                    <Botao tipo="primario">
                        <Cabecalholink URL="/sobre">Sobre</Cabecalholink>
                    </Botao>
                </div>
                
                <div className={styles.divisor}></div>
                
                <div className={classeAtiva("/eventos")}>
                    <Botao tipo="primario">
                        <Cabecalholink URL="/eventos">Eventos</Cabecalholink>
                    </Botao>
                </div>
                
                <div className={styles.divisor}></div>
                
                <div className={classeAtiva("/contato")}>
                    <Botao tipo="primario">
                        <Cabecalholink URL="/contato">Contato</Cabecalholink>
                    </Botao>
                </div>
                
                <div className={styles.divisor}></div>
                
                {/* Como esse é um Link direto, podemos aplicar as classes juntas */}
                <Link to="/catalogo" className={`${styles.linkButton} ${classeAtiva("/catalogo")}`}>
                    CATÁLOGO
                </Link>
            </nav>

            <div className={styles.divider}></div>
        </header>
    );
}

export default Cabecalho;