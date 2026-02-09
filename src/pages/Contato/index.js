import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import ContatoComp from "Components/contato";
import Mapa from "Components/mapa";   

function Contato() {   
    return (
        <>  
            <Cabecalho/>
            <ContatoComp/>
            <Mapa/>
            <Rodape/>
        </>
    );
}; 
export default Contato;