import Cabecalho from "Components/Cabecalho";
import Rodape from "Components/Rodape";
import Politica from "Components/Politica"; // Importando o componente criado acima

function Privacidade() {
    return (
        <>
            <>
                <Cabecalho />
                {/* Aqui está a instância do componente Politica */}
                <Politica />
            </>
            <Rodape />
        </>
    )
}

export default Privacidade;