//-- Versão Atual   em ( 17/11/2020 ) 
//-- By: Jurandir Ferreira
const colors = require('colors')

require('dotenv').config()

//const displayDados                  = require('./helpers/displayDados')
const getCliente                    = require('./controllers/getCliente')
const sendLog                       = require('./helpers/sendLog')

// Tempo em mseg para loop de checagem
const check_time                 = process.env.CHECK_TIME      || 10000
const time_evidencias            = process.env.TIME_EVIDENCIAS || 1800000

// Tela inicial
process.stdout.write('\x1B[2J\x1B[0f')
const titulo = '[BOT Ocorrências: iTrack]'.yellow.bgBlue.bold
console.log(titulo)
sendLog('MSG','Startup serviço')

// Ler parametros de SETUP da API do Cliente
let cliente=[] 
getCliente().then((dados)=>{
   if (dados.length>0) {
      cliente = dados[0]
   } else {
      cliente.CNPJ_CLI = '(Não Configurado.)'
   }
   console.log('Cliente Ativo:',cliente.CNPJ_CLI)
   sendLog('AVISO',`Setup cliente ${cliente.CNPJ_CLI}`)
})

