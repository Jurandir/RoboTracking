const sqlExec       = require('../../connection/sqlExec')
const sendLog       = require('../../helpers/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/rotinas/NOTASFISCAIS_INICIADAS_JOB_INSERT.sql')

var sqlCheckNF = fs.readFileSync(sqlFileName, "utf8")

async function checkNovasNFs() {    
    let dados = {}
 
    try {
        result = await sqlExec(sqlCheckNF)    
        
        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sqlCheckNF} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "checkNovasNFs", "sql" : sqlCheckNF }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = checkNovasNFs