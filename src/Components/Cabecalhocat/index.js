import { Link } from "react-router-dom";
import React, { useState } from "react";
import logo from '../../assets/imagens/SINTESE_MARCA-1.png';
import carrinho from '../../assets/imagens/carrinho.png';
import carrinhocol from '../../assets/imagens/carrinhocol.png';
import styles from './cabecalhocat.module.css';
import Cabecalholink from "Components/Cabecalholink";
import Botao from "Components/botao";
import { FaBars, FaTimes } from "react-icons/fa";
import { useCarrinho } from 'Components/carrinhocontext';

function Cabecalhocat() {
    const [menuAberto, setMenuAberto] = useState(false);
    const {quantidadeTotal} = useCarrinho();

    const toggleMenu = () => {
        setMenuAberto(!menuAberto);
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
                <Botao tipo="primario">
                    <Cabecalholink URL="/">Home</Cabecalholink>
                </Botao>
                <div className={styles.divisor}></div>
                <Botao tipo="primario">
                    <Cabecalholink URL="/sobre">Sobre</Cabecalholink>
                </Botao>
                <div className={styles.divisor}></div>
                <Botao tipo="primario">
                    <Cabecalholink URL="/eventos">Eventos</Cabecalholink>
                </Botao>
                <div className={styles.divisor}></div>
                <Botao tipo="primario">
                    <Cabecalholink URL="/contato">Contato</Cabecalholink>
                </Botao>
                <Link to="/carrinho" className={styles.carrinhoLink}>
                    {quantidadeTotal > 0 ? (
                        <img
                            src={carrinhocol}
                            alt="carrinho cheio"
                            className={styles.carrinhoIconCol}
                        />
                    ) : (
                        <img
                            src={carrinho}
                            alt="carrinho vazio"
                            className={styles.carrinhoIcon}
                        />
                    )}
                    {quantidadeTotal > 0 && (
                        <span className={styles.badge}>{quantidadeTotal}</span>
                    )}
                </Link>
            </nav>
            <div className={styles.divider}></div>
        </header>


    );
}

export default Cabecalhocat;