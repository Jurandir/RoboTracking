// Obtem dados de entrega do BD

const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/FECHAR_ENTREGAS.SQL');

var sqlEntregas = fs.readFileSync(sqlFileName, "utf8");

async function getFechaEntrega() {    
    let dados = {}
    try {
        data = await sqlQuery(sqlEntregas)
        let { Erro } = data
        if (Erro) { 
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sqlEntregas} ]`)
        }  
        dados = data
        return dados
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getFechaEntrega", "sql" : sqlEntregas }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = getFechaEntrega