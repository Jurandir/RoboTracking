const getCargaITRACK = require('../loads/getCargaITRACK')
const sqlExec        = require('../../connection/sqlExec')
const sendLog        = require('../../helpers/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlUpdateFile     =  path.join(__dirname, '../../sql/rotinas/UPDATE_CARGA_ITRACK.sql')
const sqlInsertFile     =  path.join(__dirname, '../../sql/rotinas/INSERT_CARGA_ITRACK.sql')

let sqlUpdate = fs.readFileSync(sqlUpdateFile, "utf8")
let sqlInsert = fs.readFileSync(sqlInsertFile, "utf8")

async function atualizaCargaITRECK( carga ) {    
    let { idCargaPk, idStatusPk,  idSistemaPk, danfe, nroNotaFiscal, 
        dataCriacao, destinatario, embarcador, transportador } = carga

    let dados = {success:false, message:'Paramêtros invalidos.', rows:0, command: 'None'}
    
    if(!idCargaPk) {
        return dados
    }

    let dadosCarga = await getCargaITRACK(idCargaPk)
    let sql        = dadosCarga.success ? eval('`'+sqlUpdate+'`') : eval('`'+sqlInsert+'`')
 
    try {
        result        = await sqlExec(sql)    
        dados.rows    = result.rowsAffected
        dados.command = dadosCarga.success ? 'Update' : 'Insert'
        
        if (result.rowsAffected==-1){
            throw new Error(`DB ERRO: ( ${result.Erro} )`)
        }

        dados.success = true
        dados.message = 'Sucesso. OK.'
              
        return dados
  
    } catch (err) {
        dados.success  = false
        dados.message  = err.message
        dados.err     = err
        dados.sql      = sql
        dados.routine  = 'atualizaCargaITRECK'
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = atualizaCargaITRECK