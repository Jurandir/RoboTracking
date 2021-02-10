const sendLog              = require('../../helpers/sendLog')
const dataNow              = require('../../helpers/dataNow')
const loadAPI = require('../../services/loadAPI')
const getValidadasSemEnvio = require('../loads/getValidadasSemEnvio')
const gravaRegistroEntrega = require('../comprovantes/gravaRegistroEntrega')

require('dotenv').config()

const method = 'GET'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

async function checkValidadasSemEnvio() { 
    let dados = await getValidadasSemEnvio()
    let count = dados.length

    console.log('Dados OK',count)

    for await (let element of dados) {
        let campos   = {                    
            enviado: 3,
            protocolo:'API Status: 3-Finalizado',
            danfe: element.DANFE
        }

        let idcarga  = element.IDCARGA
        let endpoint = `/User/Carga/${idcarga}/Detalhes`
        let params = {
            token: element.TOKEN
        }

        let carga = await loadAPI(method,endpoint,server,params)
        
        --count

        if(carga.dados.success) {

            let status = carga.dados.data.status.idStatusPk
            let nome   = carga.dados.data.status.nome

            if(status==3){
                campos.enviado =  3,
                campos.protocolo = 'API Status: 3-Finalizado',

                gravaRegistroEntrega(campos).then((ret)=>{
                    console.log(dataNow(),count,' - OK. Finalizado...' , element.IDCARGA, status , nome , ret)
                })

            } else {
                campos.enviado =  0,
                campos.protocolo = `API Status: ${status}-${nome}`,

                gravaRegistroEntrega(campos).then((ret)=>{
                    console.log(dataNow(),count,' - Não finalizado...', element.IDCARGA, status , nome , ret)
                })
            }

        } else {
            console.log(dataNow(),count,' - Não sucesso...', element.IDCARGA, carga.dados)
        }

    }
}

module.exports = checkValidadasSemEnvio