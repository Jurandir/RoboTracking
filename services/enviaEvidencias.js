const loadAPI = require('./loadAPI')

const method = 'POST'
const endpoint = '/User/Carga/Comprovante/Base64'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const enviaEvidencias = async (token,idCarga,imagem) => {
   //const CARGA_ID =  (process.env.NODE_ENV=='Production') ? idCarga : 6336944 // teste
   const CARGA_ID =  idCarga

    let params = {
        content: {
            idCarga: CARGA_ID,
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

/*
RESPONSE:
{
  "success": true,
  "message": "string",
  "data": [
    "string"
  ],
  "code": 0
}

*/
