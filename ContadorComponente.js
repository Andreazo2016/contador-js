const BTN_REINICIAR = 'btnReiniciar'
const ID_CONTADOR = 'contador'
const VALOR_CONTADOR = 100
const PERIODO_INTERVALO = 1000

class ContadorComponente {

    constructor() {
        this.inicializar()
    }

    prepararContadorProxy() {

        const handler = {
            set: (currentContext, propertyKey, newValue) => {
                //console.log({ currentContext, propertyKey, newValue })

                //para parar todo todo processamento
                console.log(currentContext.valor)
                if (!currentContext.valor) {
                    currentContext.efetuarParada()
                }

                currentContext[propertyKey] = newValue
                return true
            }
        }

        /*
            PROXY: Observa uma instância de um objeto, caso haja alguma
            mudança, uma função é executada.
        */

        const contador = new Proxy({
            valor: VALOR_CONTADOR,
            efetuarParada: () => { }
        }, handler)

        return contador
    }

    //Criou uma closure de uma função
    atualizarTexto = ({ elementoContador, contador }) => () => {
        const identificadorTexto = '$$contador'
        const textoPadrao = `Começando em <strong>${identificadorTexto}</strong> segundos...`
        elementoContador.innerHTML = textoPadrao.replace(identificadorTexto, contador.valor--)
    }

    agendarParadaContador({ elementoContador, idDoIntervalo }) {
        return () => {
            clearInterval(idDoIntervalo)
            elementoContador.innerHTML = ""
            this.desabilitarBotao(false)
        }
    }

    prepararBotao(elementoBotao, iniciarFn) {

        elementoBotao.addEventListener("click", iniciarFn.bind(this))

        return (valor = true) => {
            
            const atributo = 'disabled'

            if (valor) {
                elementoBotao.setAttribute(atributo, valor)
                return;
            }

            elementoBotao.removeAttribute(atributo)
        }
    }

    inicializar() {

        const elementoContador = document.getElementById(ID_CONTADOR)

        const contador = this.prepararContadorProxy()

        const argumentos = {
            elementoContador,
            contador
        }

        const closureAtualizarTexto = this.atualizarTexto(argumentos) //Guarda a instância da chamada da função
        
        const idDoIntervalo = setInterval(closureAtualizarTexto, PERIODO_INTERVALO) //Chama a função sem parâmetros


        const elemento = document.getElementById(BTN_REINICIAR)
        
        const desabilitarBotao = this.prepararBotao(elemento, this.inicializar)
        
        desabilitarBotao()
        
        const params = { elementoContador, idDoIntervalo }
        
        const paraContadorClosure = this.agendarParadaContador.apply({ desabilitarBotao }, [params])//Adiciona funcao, objeto ao context this da closure
        
        contador.efetuarParada = paraContadorClosure

    }
}