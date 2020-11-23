//-- Versão Atual   em ( 17/11/2020 ) 
//-- By: Jurandir Ferreira
const colors = require('colors')

require('dotenv').config()

const displayDados                    = require('./helpers/displayDados')
const getCliente                      = require('./controllers/getCliente')
const checkNovasNFs                   = require('./controllers/checkNovasNFs')
const registraCargaNF                 = require('./controllers/registraCargaNF')
const registraManifestoNF             = require('./controllers/registraManifestoNF')
const atualizaDataManifestoNF         = require('./controllers/atualizaDataManifestoNF')
const atualizaDataBaixaManifestoNF    = require('./controllers/atualizaDataBaixaManifestoNF')
const geraOcorrenciaChegadaFilDestino = require('./controllers/geraOcorrenciaChegadaFilDestino')
const geraOcorrenciaSaidaDoCD         = require('./controllers/geraOcorrenciaSaidaDoCD')
const getNFsNaoValidadas              = require('./controllers/getNFsNaoValidadas')
const getCargaAPIitrack               = require('./controllers/getCargaAPIitrack')
const geraOcorrenciasIniciais         = require('./controllers/geraOcorrenciasIniciais')
const getToken                        = require('./controllers/getToken')
const sendLog                         = require('./helpers/sendLog')


const check_time                 = process.env.CHECK_TIME      || 10000   // mseg 
const time_evidencias            = process.env.TIME_EVIDENCIAS || 1800000 // mseg 
const node_env                   = process.env.NODE_ENV        || 'Test' 

let sucesso                              = false
let id                                   = 0
let token                                = ''
let checks                               = 0
let notasFiscaisIncluidas                = 0
let ocorrenciasIniciaisIncluidas         = 0
let novosManifestosRegistrados           = 0
let novasOcorrenciaSaidaDoCD             = 0
let novasOcorrenciaChegadaFilial         = 0
let x_botCheckNovasNFs                   = 0
let x_botGeraOcorrenciasIniciais         = 0
let x_botGetNFsNaoValidadas              = 0
let x_botRegistraManifestoNF             = 0
let x_botGeraOcorrenciaSaidaDoCD         = 0
let x_botGeraOcorrenciaChegadaFilDestino = 0

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

// Display dados estatisticos na tela
function displayStatistics() {  
   let params = {
      checks: ++checks,
      notasfiscais: x_botCheckNovasNFs,
      validadas: x_botGetNFsNaoValidadas,
      ocorrencias: x_botGeraOcorrenciasIniciais
   }
   displayDados(params)
   setTimeout(displayStatistics,1000)
}

// Obtem o tokem para acesso a API
getToken().then((ret)=>{
   if ( (ret.err) && (!ret.token) ) {
      sendLog('ERRO',`Obter Token - Erro:(${ret.err}), Token:(${ret.token})`)
      process.exit()            
   } else {
      sucesso = ret.success
      id      = ret.id
      token   = ret.token
      sendLog('INFO',`Sucesso - Logado na API (${sucesso},${id},${node_env})`)
      monitorarOcorrencias()
   }
})

// Inclui na fila se for lançada NF nova cuja o conhecimento esteja autorizado na SEFAZ
async function botCheckNovasNFs() {
      checkNovasNFs().then((ret)=>{
         if(ret.rowsAffected>0){
            notasFiscaisIncluidas++
            sendLog('AVISO',`Notas Fiscais - Incluidas (${ret.rowsAffected})`)
         }
         x_botCheckNovasNFs += ret.rowsAffected
      })
      setTimeout(botCheckNovasNFs,check_time)
}

// Inclui na fila ocorrências iniciais
async function botGeraOcorrenciasIniciais() {
      geraOcorrenciasIniciais().then((ret)=>{
         if(ret.rowsAffected>0){
            ocorrenciasIniciaisIncluidas++
            sendLog('AVISO',`Ocorrências Iniciais - Incluidas (${ret.rowsAffected})`)
         }
         x_botGeraOcorrenciasIniciais +=  ret.rowsAffected
      })      
      setTimeout(botGeraOcorrenciasIniciais,check_time)
}

// Registra Manifesto na NF
async function botRegistraManifestoNF() {
   registraManifestoNF().then((ret)=>{
      if(ret.rowsAffected>0){
         novosManifestosRegistrados++
         sendLog('AVISO',`Registro de novos manifestos - (${ret.rowsAffected})`)
      }
      x_botRegistraManifestoNF +=  ret.rowsAffected
   })      
   setTimeout(botRegistraManifestoNF,check_time)
}

// Gera ocorrências de saida do CD
async function botGeraOcorrenciaSaidaDoCD() {
   await geraOcorrenciaSaidaDoCD().then((ret)=>{
      if(ret.rowsAffected>0){
         novasOcorrenciaSaidaDoCD++
         sendLog('AVISO',`Manifestos - Ocorrências de saída - (${ret.rowsAffected})`)
      }
      x_botGeraOcorrenciaSaidaDoCD +=  ret.rowsAffected
   })      
   await atualizaDataManifestoNF()
   setTimeout(botGeraOcorrenciaSaidaDoCD,check_time)
}

// Gera ocorrências - "CHEGADA NA CIDADE OU FILIAL DE DESTINO"
async function botGeraOcorrenciaChegadaFilDestino() {
   await geraOcorrenciaChegadaFilDestino().then((ret)=>{
      if(ret.rowsAffected>0){
         novasOcorrenciaChegadaFilial++
         sendLog('AVISO',`Baixa - Ocorrências de Chegada Filial destino - (${ret.rowsAffected})`)
      }
      x_botGeraOcorrenciaChegadaFilDestino +=  ret.rowsAffected
   })      
   await atualizaDataBaixaManifestoNF()
   setTimeout(botGeraOcorrenciaChegadaFilDestino,check_time)
}

// Valida na API a NF para o destinatario
async function botGetNFsNaoValidadas() {
   getNFsNaoValidadas().then((notas)=>{
      if(notas.length==0) {
         return
      }              
      notas.map((nota)=>{
         let cnpj = nota.CNPJ_DESTINATARIO
         let nroFiscal = nota.NUMERO 
         getCargaAPIitrack(token,cnpj,nroFiscal).then((ret)=>{
            let count          = ret.dados.data.count
            let isAxiosError   = ret.isAxiosError
            let isErr          = ret.isErr
            if(( count==0) || (isErr==true) || (isAxiosError==true)) {
               sendLog('WARNING',`(Validação Falhou) - Destinatário: ${cnpj}, NF: ${nroFiscal}, NÃO OK, Erro: ${isErr},AxiosErro: ${isAxiosError} .`)
               registraCargaNF(nota.DANFE,0)
               return
            }
            let danfe     = ret.dados.data.list[0].carga.danfe
            let idCargaPk = ret.dados.data.list[0].carga.idCargaPk
            let success   = ret.dados.success
            let nf = ret.dados.data.list[0].carga.nroNotaFiscal
            if ( success==true) {
               registraCargaNF(danfe,idCargaPk).then((ok)=>{
                  x_botGetNFsNaoValidadas += ok.rowsAffected
                  sendLog('SUCESSO',`(Validação) - Carga: ${idCargaPk}, NF: ${nf}, Danfe: ${danfe}, OK.`)
               })
            }
         })
      })
   })
   setTimeout(botGetNFsNaoValidadas,check_time)
}

// Monitor de ocorrências - disparo inicial dos Bot´s
async function monitorarOcorrencias() {
      botCheckNovasNFs()
      botGeraOcorrenciasIniciais()
      botGetNFsNaoValidadas()
      botRegistraManifestoNF()
      botGeraOcorrenciaSaidaDoCD()
      botGeraOcorrenciaChegadaFilDestino()
      displayStatistics()
}
