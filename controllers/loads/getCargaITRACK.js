// Obtem dados de entrega do BD

const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/CARGA_ITRACK.sql');

var sqlCarga = fs.readFileSync(sqlFileName, "utf8");

async function getCargaITRACK(idCargaPk) {    
    let dados = { success: false, message:'Sem Dados.'  ,data :[], rows:0  }
    let sql = eval('`'+sqlCarga+'`');
    try {
        data = await sqlQuery(sql)
        let { Erro } = data
        
        if (Erro) { throw new Error(`DB ERRO: ( ${Erro} )`) }
        
        dados.rows    = data.length   
        dados.success = ( data.length > 0 )
        dados.message = ( data.length > 0 ) ? 'Sucesso. OK.' : 'Sem Dados.'
        dados.data    = data
        
        return dados
    } catch (err) {

        dados.rows    = -1   
        dados.success = false
        dados.message = err.message
        dados.data    = []
        dados.sql     = sql

        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = getCargaITRACK