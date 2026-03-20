import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import ContatoComp from "Components/contato";
import Mapa from "Components/mapa";   
import WhatsAppButton from "Components/WhatsAppButton"; // 👈 import
function Contato() {   
    return (
        <>  
            <Cabecalho/>
            <ContatoComp/>
            <Mapa/>
            <Rodape/>
            <WhatsAppButton />
        </>
    );
}; 
export default Contato;