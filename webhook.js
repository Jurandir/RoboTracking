//-- Versão Atual   em ( 17/11/2020 ) 
//-- By: Jurandir Ferreira
const colors = require('colors')

require('dotenv').config()

//const displayDados                  = require('./helpers/displayDados')
const getCliente                    = require('./controllers/getCliente')
const checkNovasNFs                 = require('./controllers/checkNovasNFs')
const geraOcorrenciasIniciais       = require('./controllers/geraOcorrenciasIniciais')
const getToken                      = require('./controllers/getToken')
const sendLog                       = require('./helpers/sendLog')

// Tempo em mseg para loop de checagem
const check_time                 = process.env.CHECK_TIME      || 10000
const time_evidencias            = process.env.TIME_EVIDENCIAS || 1800000

// Tela inicial
process.stdout.write('\x1B[2J\x1B[0f')
const titulo = '[BOT Ocorrências: iTrack]'.yellow.bgBlue.bold
console.log(titulo)
sendLog('MSG','Startup serviço')

// Verifica clientes habilitados
getCliente().then((dados)=>{
   if (dados.length>0) {
      dados.forEach(cliente => {
         console.log('Cliente Ativo:',cliente.CNPJ_CLI)
         sendLog('AVISO',`Setup cliente ${cliente.CNPJ_CLI}`)            
      })
   } else {
      console.log('Cliente:','(Não Configurado.)')
      sendLog('WARNING',`Setup cliente (Não Configurado.)`)
      process.exit()            
   }
})

let sucesso
let id
let token
let notasFiscaisIncluidas = 0
let ocorrenciasIniciaisIncluidas = 0

getToken().then((ret)=>{
   if ( (ret.err) && (!ret.token) ) {
      console.log('Token ERRO')
      sendLog('ERRO',`Obter Token - Erro:(${ret.err}), Token:(${ret.token})`)
      process.exit()            
   } else {
      sucesso = ret.success
      id      = ret.id
      token   = ret.token
      sendLog('INFO',`Sucesso - Logado na API (${sucesso},${id})`)
   }
})

checkNovasNFs().then((ret)=>{
   if(ret.rowsAffected>0){
      notasFiscaisIncluidas++
      sendLog('SUCESSO',`Notas Fiscais - Incluidas (${ret.rowsAffected})`)
   }
})

geraOcorrenciasIniciais().then((ret)=>{
   if(ret.rowsAffected>0){
      ocorrenciasIniciaisIncluidas++
      sendLog('SUCESSO',`Ocorrências Iniciais - Incluidas (${ret.rowsAffected})`)
   }
})      

