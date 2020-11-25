const loadAPI = require('./loadAPI')

const method = 'POST'
const endpoint = '/User/Carga/Comprovante/Base64'
//const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE
const server =  process.env.URL_TESTE

const enviaEvidencias = async (token,idCarga,imagem) => {

    let params = {
        content: {
            idCarga: idCarga,
            fotosOcorrencia: [],
            fotosComprovante: [{
                    extensao: "PNG",
                    imageBase64: imagem
             }] 
        },
           token: token
        }    
    return await loadAPI(method,endpoint,server,params)
}

module.exports = enviaEvidencias
