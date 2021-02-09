const sendLog              = require('../../helpers/sendLog')
const loadAPI = require('../../services/loadAPI')
const getValidadasSemEnvio = require('../loads/getValidadasSemEnvio')
const gravaRegistroEntrega = require('../comprovantes/gravaRegistroEntrega')

require('dotenv').config()

const method = 'GET'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

async function checkValidadasSemEnvio() { 
    let dados = await getValidadasSemEnvio()

    console.log('Dados OK')

    for await (let element of dados) {
        let idcarga  = element.IDCARGA
        let endpoint = `/User/Carga/${idcarga}/Detalhes`
        let params = {
            token: element.TOKEN
        }

        let carga = await loadAPI(method,endpoint,server,params)
        if(carga.dados.success) {

            let status = carga.dados.data.status.idStatusPk
            let nome   = carga.dados.data.status.nome

            if(status==3){
                let campos ={
                    enviado: 3,
                    protocolo:'API Status: 3-Finalizado',
                    danfe: element.DANFE
                }

                gravaRegistroEntrega(campos).then((ret)=>{
                    console.log('OK. Finalizado' , element.IDCARGA , ret)
                })

                console.log('finalizado!!!!', element.IDCARGA)
            } else {
                console.log('Não finalizado...', status , nome )
            }

        } else {
            console.log('Não sucesso...', element.IDCARGA, carga.dados)
        }

    }

}

module.exports = checkValidadasSemEnvio