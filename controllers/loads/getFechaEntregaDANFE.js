// Obtem dados de entrega do BD

const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/FECHAR_ENTREGA_DANFE.SQL');

var sqlEntregas = fs.readFileSync(sqlFileName, "utf8");

async function getFechaEntregaDANFE(danfe) {    
    let dados = {}
    let DANFE = danfe
    let sql = eval('`'+sqlEntregas+'`');
    try {
        data = await sqlQuery(sql)
        let { Erro } = data
        if (Erro) { 
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sql} ]`)
        }  
        dados = data[0]
        return dados
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getFechaEntregaDANFE", "sql" : sql }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = getFechaEntregaDANFE