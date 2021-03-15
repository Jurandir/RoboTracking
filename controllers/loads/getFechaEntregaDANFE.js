// Obtem dados de entrega do BD

const sqlQuery       = require('../../connection/sqlQuery')
const sendLog        = require('../../helpers/sendLog')
const fs             = require('fs')
const path           = require('path')
const sqlFileName    =  path.join(__dirname, '../../sql/consultas/FECHAR_ENTREGA_DANFE.SQL');
const sqlFileSemMapa =  path.join(__dirname, '../../sql/consultas/FECHAR_ENTREGA_DANFE_SEM_MAPA_ENTREGA.SQL');

var sqlEntregas = fs.readFileSync(sqlFileName, "utf8");
var sqlSemMapa  = fs.readFileSync(sqlFileSemMapa, "utf8");

async function getFechaEntregaDANFE(danfe,semMapa) {    
    let dados = {}
    let DANFE = danfe
    let sqlEval = semMapa ? sqlSemMapa : sqlEntregas
    let sql = eval('`'+sqlEval+'`');
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