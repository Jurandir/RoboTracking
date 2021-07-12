const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/GET_NF_DANFE.sql');

let sqlPesquisa     = fs.readFileSync(sqlFileName, "utf8");

async function getNF_DANFE(danfe) { 
    let sql = eval('`'+sqlPesquisa+'`');   
    let dados = {}
    try {
        data = await sqlQuery(sql)
        let { Erro } = data
        if (Erro) { 
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sql} ]`)
        }  
        dados = data
        return dados
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getNF_DANFE", "sql" : sql }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = getNF_DANFE