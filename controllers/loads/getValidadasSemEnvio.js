const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/NF_VALIDADAS_SEM_ENVIO.sql');

var sqlValidadas = fs.readFileSync(sqlFileName, "utf8");

async function getValidadasSemEnvio() {    
    let dados = {}
    try {
        data = await sqlQuery(sqlValidadas)
        let { Erro } = data
        if (Erro) { 
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sqlValidadas} ]`)
        }  
        dados = data
        return dados
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getValidadasSemEnvio", "sql" : sqlValidadas }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = getValidadasSemEnvio