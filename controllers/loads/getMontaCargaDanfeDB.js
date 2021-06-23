// Obtem dados de entrega do BD

const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')
const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/NOVA_CARGA_ITRACK_TMS.sql');

var sqlCarga = fs.readFileSync(sqlFileName, "utf8");

async function getMontaCargaDanfeDB(danfe) {    
    let dados = { success: false, message: 'Danfe não localizado.', data:{}  }
    let sql = eval('`'+sqlCarga+'`');
    try {
        data = await sqlQuery(sql)
        
        let campos = data[0]
        let newobj = {}
        for  ( let campo in campos ) {
            let elementos = `${campo}`.split('_')
            let len       = elementos.length
            
            if(len==1){
                newobj[elementos[0]] = campos[campo]
            } else 
            if(len==2){
                if(!newobj[elementos[0]]){
                    newobj[elementos[0]] = {}
                }
                newobj[elementos[0]][elementos[1]] = campos[campo]
            } else
            if(len==3){
                if(!newobj[elementos[0]]){
                    newobj[elementos[0]] = {}
                }
                if(!newobj[elementos[0]][elementos[1]]){
                    newobj[elementos[0]][elementos[1]] = {}
                }
                newobj[elementos[0]][elementos[1]][elementos[2]] = campos[campo]
            } else
            if(len==4){
                if(!newobj[elementos[0]]){
                    newobj[elementos[0]] = {}
                }
                if(!newobj[elementos[0]][elementos[1]]){
                    newobj[elementos[0]][elementos[1]] = {}
                }
                if(!newobj[elementos[0]][elementos[1]][elementos[2]]){
                    newobj[elementos[0]][elementos[1]][elementos[2]] = {}
                }
                newobj[elementos[0]][elementos[1]][elementos[2]][elementos[3]] = campos[campo]
            }
        }

        let { Erro } = data
        
        if (Erro) { throw new Error(`DB ERRO: ( ${Erro} )`) }
        
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