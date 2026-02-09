import React, { useState } from 'react';
import styles from './mapa.module.css';

// Importe a imagem completa do mapa
import mapaBrasilCompleto from '../../assets/imagens/brasil-02.png';

const Mapa = () => {
    const [modalAberto, setModalAberto] = useState(false);
    const [regiaoSelecionada, setRegiaoSelecionada] = useState(null);
    const [regiaoHover, setRegiaoHover] = useState(null);

    const regioes = {
        norte: {
            nome: 'REGIÃO NORTE',
            cor: '#3CAFCE',
            representantes: [
                {
                    empresa: 'JIRON BIOTECH',
                    locais: 'Acre, Amapá, Amazonas, Pará, Rondônia, Roraima, Tocantins',
                    telefone: '(76) 99207-3824',
                    email: 'jironbiotech@gmail.com'
                }
            ]
        },
        nordeste: {
            nome: 'REGIÃO NORDESTE',
            cor: '#5B7FBE',
            representantes: [
                {
                    empresa: 'JIRON BIOTECH',
                    locais: 'Maranhão, Piauí, Ceará, Rio Grande do Norte, Paraíba, Pernambuco, Alagoas, Sergipe, Bahia',
                    telefone: '(71) 99207-3824',
                    email: 'jironbiotech@gmail.com'
                }
            ]
        },
        centroOeste: {
            nome: 'REGIÃO CENTRO-OESTE',
            cor: '#F5B800',
            representantes: [
                {
                    empresa: 'RM / NANOFORTECH',
                    locais: 'Goiás, Distrito Federal',
                    contato: 'Henrique D\'Luz / Viapex',
                    telefone: '(61) 99569-4359',
                    email: 'henrique.dluz@nftcorp.com'
                },
                {
                    empresa: 'SÍNTESE BIOTECNOLOGIA',
                    locais: 'Mato Grosso, Mato Grosso do Sul',
                    contato: 'Customer Service',
                    telefone: '0(5) 5024-0004',
                    email: 'customerservice@sintesebio.com.br'
                }
            ]
        },
        sudeste: {
            nome: 'REGIÃO SUDESTE',
            cor: '#1E3A8A',
            representantes: [
                {
                    empresa: 'SÍNTESE BIOTECNOLOGIA',
                    locais: 'Minas Gerais, Espírito Santo',
                    contato: 'Iago Oliveira',
                    telefone: '(31) 97404-9602',
                    email: 'iago.dorf@sintesebio.com.br'
                },
                {
                    empresa: 'SÍNTESE BIOTECNOLOGIA',
                    locais: 'São Paulo, Rio de Janeiro',
                    contato: 'Sergio Domenico',
                    telefone: '(16) 97400-0901',
                    email: 'sergio@sintesebio.com.br'
                }
            ]
        },
        sul: {
            nome: 'REGIÃO SUL',
            cor: '#3CAFCE',
            representantes: [
                {
                    empresa: 'SÍNTESE BIOTECNOLOGIA',
                    locais: 'Paraná, Santa Catarina, Rio Grande do Sul',
                    contato: 'Customer Service',
                    telefone: '0(5) 5024-0004',
                    email: 'comercial2@sintesebio.com.br'
                }
            ]
        },
    };

    const abrirModal = (regiaoKey) => {
        setRegiaoSelecionada(regioes[regiaoKey]);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setRegiaoSelecionada(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>ENCONTRE UM REPRESENTANTE DA SUA REGIÃO</h1>
            </div>

            <div className={styles.conteudo}>
                <p className={styles.instrucao}>
                    Clique em uma região do mapa para ver os representantes
                </p>
                
                <div className={styles.mapaContainer}>
                    <div className={styles.mapaBrasil}>
                        <div className={styles.mapaWrapper}>
                            {/* Imagem do mapa completo */}
                            <img 
                                src={mapaBrasilCompleto} 
                                alt="Mapa do Brasil"
                                className={styles.mapaBase}
                            />
                            
                            {/* SVG overlay com áreas clicáveis - viewBox baseado nas coordenadas do image-map */}
                            <svg 
                                viewBox="0 0 13500 12500" 
                                className={styles.svgOverlay}
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {/* Região Sul */}
                                <path
                                    d="M 6209,9464 L 6384,8916 L 6629,8660 L 7049,8765 L 7457,8870 L 7644,9231 L 7889,9441 L 7807,9686 L 7772,10001 L 7714,10374 L 7492,10560 L 7329,10898 L 6947,11160 L 6609,11638 L 6469,11230 L 6174,11050 L 5860,10875 L 5533,10689 L 5813,10338 L 6338,9942 L 6489,9779 L 6384,9452 L 6271,9400 Z"
                                    className={`${styles.regiaoPath} ${regiaoHover === 'sul' ? styles.hover : ''}`}
                                    fill={regiaoHover === 'sul' ? 'rgba(60, 175, 206, 0.3)' : 'transparent'}
                                    onClick={() => abrirModal('sul')}
                                    onMouseEnter={() => setRegiaoHover('sul')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                />
                                
                                {/* Região Sudeste */}
                                <path
                                    d="M 7271,7614 L 7621,7510 L 7889,7533 L 8087,7346 L 8075,7148 L 8075,6880 L 8227,6868 L 8227,6623 L 8352,6618 L 8947,6396 L 9623,6711 L 9996,6898 L 9856,7341 L 10113,7492 L 9751,8425 L 9427,8721 L 8973,8733 L 8507,8896 L 8250,9094 L 7936,9351 L 7563,9106 L 7470,8768 L 7131,8722 L 6630,8617 L 7108,7801 L 7201,7719 L 7271,7649 Z"
                                    className={`${styles.regiaoPath} ${regiaoHover === 'sudeste' ? styles.hover : ''}`}
                                    fill={regiaoHover === 'sudeste' ? 'rgba(30, 58, 138, 0.3)' : 'transparent'}
                                    onClick={() => abrirModal('sudeste')}
                                    onMouseEnter={() => setRegiaoHover('sudeste')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                />
                                
                                {/* Região Nordeste */}
                                <path
                                    d="M 8507,2922 L 8020,3946 L 8254,4607 L 8510,5249 L 8510,6496 L 9139,6345 L 10011,6832 L 9976,7275 L 10140,7462 L 10348,6198 L 10627,5872 L 11105,5114 L 11420,4648 L 10909,3929 L 10058,3346 L 8881,3276 L 9068,3404 L 9580,3521 Z"
                                    className={`${styles.regiaoPath} ${regiaoHover === 'nordeste' ? styles.hover : ''}`}
                                    fill={regiaoHover === 'nordeste' ? 'rgba(91, 127, 190, 0.3)' : 'transparent'}
                                    onClick={() => abrirModal('nordeste')}
                                    onMouseEnter={() => setRegiaoHover('nordeste')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                />
                                
                                {/* Região Norte */}
                                <path
                                    d="M 7192,1956 L 7385,2526 L 8399,2899 L 7919,3883 L 8329,6039 L 7502,5993 L 7292,5188 L 5778,5072 L 5346,4605 L 5300,4512 L 5102,4885 L 4368,4955 L 4432,5519 L 4851,5577 L 4805,6008 L 4665,6102 L 3674,5775 L 3453,5157 L 3115,5181 L 2771,5464 L 2142,5522 L 2107,5114 L 1851,5243 L 1431,5079 L 1268,4520 L 1501,3948 L 2061,3715 L 2364,3400 L 2364,3086 L 2223,2561 L 2484,2189 L 3009,2329 L 3463,2434 L 3953,1944 L 3650,1513 L 4768,1560 L 4908,2154 L 5456,2189 L 5957,1956 L 6632,2049 L 7005,1501 Z"
                                    className={`${styles.regiaoPath} ${regiaoHover === 'norte' ? styles.hover : ''}`}
                                    fill={regiaoHover === 'norte' ? 'rgba(60, 175, 206, 0.3)' : 'transparent'}
                                    onClick={() => abrirModal('norte')}
                                    onMouseEnter={() => setRegiaoHover('norte')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                />
                                
                                {/* Região Centro-Oeste */}
                                <path
                                    d="M 5362,8021 L 5386,8464 L 6016,8592 L 6038,8931 L 6283,9001 L 7146,7847 L 7962,7403 L 8323,6237 L 7274,5946 L 7006,5223 L 5363,4955 L 4525,5153 L 4863,6832 L 5259,6915 L 5387,7288 L 5537,7462 Z"
                                    className={`${styles.regiaoPath} ${regiaoHover === 'centroOeste' ? styles.hover : ''}`}
                                    fill={regiaoHover === 'centroOeste' ? 'rgba(245, 184, 0, 0.3)' : 'transparent'}
                                    onClick={() => abrirModal('centroOeste')}
                                    onMouseEnter={() => setRegiaoHover('centroOeste')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                />
                            </svg>
                        </div>

                        {/* Legenda das regiões */}
                        <div className={styles.legendaContainer}>
                            <div className={styles.legendaGrid}>
                                <div 
                                    className={`${styles.legendaItem} ${regiaoHover === 'norte' ? styles.legendaHover : ''}`}
                                    onMouseEnter={() => setRegiaoHover('norte')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                    onClick={() => abrirModal('norte')}
                                >
                                    <div className={styles.legendaCor} style={{ backgroundColor: '#3CAFCE' }}></div>
                                    <span>Norte</span>
                                </div>
                                <div 
                                    className={`${styles.legendaItem} ${regiaoHover === 'nordeste' ? styles.legendaHover : ''}`}
                                    onMouseEnter={() => setRegiaoHover('nordeste')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                    onClick={() => abrirModal('nordeste')}
                                >
                                    <div className={styles.legendaCor} style={{ backgroundColor: '#5B7FBE' }}></div>
                                    <span>Nordeste</span>
                                </div>
                                <div 
                                    className={`${styles.legendaItem} ${regiaoHover === 'centroOeste' ? styles.legendaHover : ''}`}
                                    onMouseEnter={() => setRegiaoHover('centroOeste')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                    onClick={() => abrirModal('centroOeste')}
                                >
                                    <div className={styles.legendaCor} style={{ backgroundColor: '#F5B800' }}></div>
                                    <span>Centro-Oeste</span>
                                </div>
                                <div 
                                    className={`${styles.legendaItem} ${regiaoHover === 'sudeste' ? styles.legendaHover : ''}`}
                                    onMouseEnter={() => setRegiaoHover('sudeste')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                    onClick={() => abrirModal('sudeste')}
                                >
                                    <div className={styles.legendaCor} style={{ backgroundColor: '#1E3A8A' }}></div>
                                    <span>Sudeste</span>
                                </div>
                                <div 
                                    className={`${styles.legendaItem} ${regiaoHover === 'sul' ? styles.legendaHover : ''}`}
                                    onMouseEnter={() => setRegiaoHover('sul')}
                                    onMouseLeave={() => setRegiaoHover(null)}
                                    onClick={() => abrirModal('sul')}
                                >
                                    <div className={styles.legendaCor} style={{ backgroundColor: '#3CAFCE' }}></div>
                                    <span>Sul</span>
                                </div>
                            </div>
                        </div>
                    </div>

                
                </div>
            </div>

            {/* Modal */}
            {modalAberto && regiaoSelecionada && (
                <div className={styles.modalOverlay} onClick={fecharModal}>
                    <div className={styles.modalConteudo} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.btnFechar} onClick={fecharModal}>
                            <span>×</span>
                        </button>
                        
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitulo}>{regiaoSelecionada.nome}</h2>
                        </div>
                        
                        <div className={styles.representantesList}>
                            {regiaoSelecionada.representantes.map((rep, index) => (
                                <div key={index} className={styles.representanteCard}>
                                    <div className={styles.cardHeader}>
                                        <h3>{rep.empresa}</h3>
                                    </div>
                                    <div className={styles.cardBody}>
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>Localidades:</span>
                                            <span className={styles.value}>{rep.locais}</span>
                                        </div>
                                        {rep.contato && (
                                            <div className={styles.infoRow}>
                                                <span className={styles.label}>Contato:</span>
                                                <span className={styles.value}>{rep.contato}</span>
                                            </div>
                                        )}
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>Telefone:</span>
                                            <span className={styles.value}>{rep.telefone}</span>
                                        </div>
                                        <div className={styles.infoRow}>
                                            <span className={styles.label}>Email:</span>
                                            <a href={`mailto:${rep.email}`} className={styles.emailLink}>
                                                {rep.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mapa;