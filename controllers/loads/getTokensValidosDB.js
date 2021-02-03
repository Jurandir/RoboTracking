const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/TOKENS_ITRACK.SQL');

var sqlFiliais = fs.readFileSync(sqlFileName, "utf8");

async function getTokensValidosDB() {    
    let dados = {}
  
    try {
        data = await sqlQuery(sqlFiliais)
  
        let { Erro } = data
        if (Erro) { 
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sqlFiliais} ]`)
        }  
               
        dados = data
        return dados
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getTokensValidos", "sql" : sqlFiliais }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = getTokensValidosDB