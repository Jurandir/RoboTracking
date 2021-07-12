// Monsta JSON - Criação de carga

const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')
const dataSetToJson = require('../../helpers/dataSetToJson')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/NOVA_CARGA_ITRACK_TMS.sql');

var sqlCarga = fs.readFileSync(sqlFileName, "utf8");

async function getMontaCargaDanfeDB(danfe) {    
    let dados = { success: false, message: 'Danfe não localizado.', data:{}  }
    let sql = eval('`'+sqlCarga+'`');
    try {
        let data     = await sqlQuery(sql)
        let { Erro } = data       
        if (Erro) { throw new Error(`DB ERRO: ( ${Erro} )`) }

        let newobj   = dataSetToJson( data )
        
        dados.rows    = data.length   
        dados.success = ( data.length > 0 )
        dados.message = ( data.length > 0 ) ? 'Sucesso. OK.' : 'Sem Dados.'
        dados.data    = newobj
        
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

module.exports = getMontaCargaDanfeDB