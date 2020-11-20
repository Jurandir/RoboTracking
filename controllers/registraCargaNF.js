const sqlExec       = require('../connection/sqlExec')
const sendLog       = require('../helpers/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../sql/rotinas/UPDATE_CARGA_NF.sql')

var sqlCheckNF = fs.readFileSync(sqlFileName, "utf8")

async function registraCargaNF(danfe,idcarga) {    
    let dados = {}

    let sql = eval('`'+sqlCheckNF+'`');
 
    try {
        result = await sqlExec(sql)    
        
        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sql} ]`)
        }
              
        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "registraCargaNF", "sql" : sql, rowsAffected: -1 }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = registraCargaNF