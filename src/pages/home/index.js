import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import Hero from "Components/hero";
import Marcas from "Components/marcas"
import Cardcarrosel from "Components/Cardcarrosel";
import Cookies from "Components/cookies";   
import Estatisticas from "Components/estatistica";  
function Home() {
    return (
        <>
            <Cookies />
            <Cabecalho />
            <Hero />
            <Marcas />
            <Estatisticas />
            <Cardcarrosel />
            <Rodape />
        </>
    );
}

export default Home;

