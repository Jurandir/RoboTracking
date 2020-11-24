const sqlQuery      = require('../../connection/sqlQuery')
const sendLog       = require('../../helpers/sendLog')

const fs            = require('fs')
const path          = require('path')
const sqlFileName   =  path.join(__dirname, '../../sql/consultas/NOTASFISCAIS_NAO_VALIDADAS.sql')

var sqlGetNFs = fs.readFileSync(sqlFileName, "utf8")

async function getNFsNaoValidadas() {    
    let dados         = {}
  
    try {
        data = await sqlQuery(sqlGetNFs)
  
        let { Erro } = data
        if (Erro) { 

            console.log('ERRO:',Erro)
            throw new Error(`DB ERRO - ${Erro} : SQL => [ ${sqlGetNFs} ]`)
        }  
               
        dados = data
        return dados
  
    } catch (err) {
        dados = { "erro" : err.message, "rotina" : "getNFsNaoValidadas", "sql" : sqlGetNFs }
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    } 
}

module.exports = getNFsNaoValidadas