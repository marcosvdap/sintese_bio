import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import Evento from "Components/evento";
import Galeria from "Components/galeria";
import WhatsAppButton from "Components/WhatsAppButton"; // 👈 import   

function Eventos() {   
    return (
        <>  
            <Cabecalho/>
            <Evento/>
            <Galeria/>
            <Rodape/>
            <WhatsAppButton />
        </>
    );
}
export default Eventos;

