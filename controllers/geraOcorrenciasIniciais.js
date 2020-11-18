const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../helpers/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/rotinas/TRACKING_INICIAL_JOB_INSERT.sql')

var sqlInicial = fs.readFileSync(sqlFileName, "utf8")

const geraOcorrenciasIniciais = async () => {
    let dados = {} 
    try {
        result = await sqlExec(sqlInicial)    
        
        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sqlInicial} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "geraOcorrenciasIniciais", "sql" : sqlInicial }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 

}

module.exports = geraOcorrenciasIniciais
