import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import Hero from "Components/hero";
import Marcas from "Components/marcas";
import Cardcarrosel from "Components/Cardcarrosel";
import Cookies from "Components/cookies";
import Estatisticas from "Components/estatistica";
import WhatsAppButton from "Components/WhatsAppButton"; // 👈 import

function Home() {
    return (
        <>
            <Cookies />
            <Cabecalho />
            <WhatsAppButton />
            <Hero />
            <Marcas />
            <Estatisticas />
            <Cardcarrosel />
            <Rodape />
            
        </>
    );
}

export default Home;