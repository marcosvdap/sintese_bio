import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import Sobre from "Components/sobre";
import WhatsAppButton from "Components/WhatsAppButton"; // 👈 import

function About() {
    return (
        <>
            <>
                <Cabecalho />
                <Sobre />

            </>
            <Rodape />
            <WhatsAppButton />
        </>
    )
}
export default About;
