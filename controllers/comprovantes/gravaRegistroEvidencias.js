const sqlExec       = require('../../connection/sqlExec')
const sendLog       = require('../../helpers/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/UPDATE_EVIDENCIA_NF.sql');

async function gravaRegistroEvidencias(evidencia) {    
    let dados = {}
    let sql = eval('`'+sqlFileName+'`');

    try {
        result = await sqlExec(sql)       

        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO - ${result.Erro} : SQL => [ ${sql} ]`)
        }

        return result
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "gravaRegistroEvidencias", "sql" : sql,"registro": evidencia }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = gravaRegistroEvidencias

