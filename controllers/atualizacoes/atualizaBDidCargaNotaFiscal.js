const sqlExec       = require('../../connection/sqlExec')
const sendLog       = require('../../helpers/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlUpdateFile =  path.join(__dirname, '../../sql/rotinas/UPDATE_IDCARGA_VIA_BD.sql')
let sqlUpdate       = fs.readFileSync(sqlUpdateFile, "utf8")

async function atualizaBDidCargaNotaFiscal( ) {    
    let dados = {success:false, message:'', rows:0, command: 'None'}
    let sql   = eval('`'+sqlUpdate+'`')
 
    try {
        result        = await sqlExec(sql)    
        dados.rows    = result.rowsAffected
        dados.command = 'Update'
        
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
        dados.routine  = 'atualizaBDidCargaNotaFiscal'
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = atualizaBDidCargaNotaFiscal