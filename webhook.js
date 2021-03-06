//-- Versão Atual em ( 03/02/2021 ) 
//-- By: Jurandir Ferreira
const colors       = require('colors')
const INSERT_CARGA = false

require('dotenv').config()

const displayDados                    = require('./helpers/displayDados')
const getCliente                      = require('./controllers/loads/getCliente')
const checkNovasNFs                   = require('./controllers/atualizacoes/checkNovasNFs')
const registraCargaNF                 = require('./controllers/atualizacoes/registraCargaNF')
const checkNovasEvidencias            = require('./controllers/envios/checkNovasEvidencias')
const checkNovosComprovantes          = require('./controllers/envios/checkNovosComprovantes')
const insertCargaNaAPI                = require('./controllers/atualizacoes/insertCargaNaAPI') 
const registraManifestoNF             = require('./controllers/atualizacoes/registraManifestoNF')
const atualizaDataManifestoNF         = require('./controllers/atualizacoes/atualizaDataManifestoNF')
const atualizaDataBaixaManifestoNF    = require('./controllers/atualizacoes/atualizaDataBaixaManifestoNF')
const geraOcorrenciaChegadaFilDestino = require('./controllers/eventos/geraOcorrenciaChegadaFilDestino')
const geraOcorrenciasIniciais         = require('./controllers/eventos/geraOcorrenciasIniciais')
const geraOcorrenciaSaidaDoCD         = require('./controllers/eventos/geraOcorrenciaSaidaDoCD')
const checkEnviaOcorrencias           = require('./controllers/envios/checkEnviaOcorrencias')
const geraOcorrenciasTMS              = require('./controllers/eventos/geraOcorrenciasTMS')
const getNFsNaoValidadas              = require('./controllers/loads/getNFsNaoValidadas')
const getCargaAPIitrack               = require('./controllers/loads/getCargaAPIitrack')
const tokensValidos                   = require('./controllers/loads/tokensValidos')
const get_idCargaPK_DANFE               = require('./controllers/loads/get_idCargaPK_DANFE')
const sendLog                         = require('./helpers/sendLog')

const check_time                 = process.env.CHECK_TIME      || 60000   // mseg 
const time_evidencias            = process.env.TIME_EVIDENCIAS || 1800000 // mseg 
const node_env                   = process.env.NODE_ENV        || 'Test'  // Production / Developer 

sendLog('MSG','Startup serviço - Upd. 02/07/2021')

let sucesso                              = false
let id                                   = 0
let token                                = ''
let checks                               = 0

let notasFiscaisIncluidas                = 0
let ocorrenciasIniciaisIncluidas         = 0
let novosManifestosRegistrados           = 0
let novasOcorrenciaSaidaDoCD             = 0
let ocorrenciasTracking                  = 0
let novasOcorrenciaChegadaFilial         = 0
let novosOcorrenciasTMS                  = 0
let novosEncerramentos                   = 0
let novosComprovantes                    = 0

let x_botCheckNovasNFs                   = 0
let x_botGeraOcorrenciasIniciais         = 0
let x_botGetNFsNaoValidadas              = 0
let x_botRegistraManifestoNF             = 0
let x_botGeraOcorrenciaSaidaDoCD         = 0
let x_botGeraOcorrenciaChegadaFilDestino = 0
let x_botGeraOcorrenciasTMS              = 0
let x_botCheckNovasEvidencias            = 0
let x_botCheckEnviaOcorrencias           = 0
let x_botCheckNovosComprovantes          = 0

// Tela inicial
process.stdout.write('\x1B[2J\x1B[0f')
const titulo = '[BOT Ocorrências: iTrack]'.yellow.bgBlue.bold
console.log(titulo)
sendLog('INFO',`CHECK TIME REF.: ${check_time/1000} Seg., CHECK DOCS IMAGEM: ${time_evidencias/1000/60} Min.`)

// 00: getCliente()
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
      checks: checks,
      notasfiscais: x_botCheckNovasNFs || 0,
      validadas: x_botGetNFsNaoValidadas,
      ocorrencias: x_botGeraOcorrenciasIniciais
   }
   displayDados(params)
   setTimeout(displayStatistics,1000)
}


global.TOKENS = []

// Obtem os tokens para acesso a API
tokensValidos().then(x=>{
   // id, token
   sendLog('INFO',`Sucesso - Logado na API (${node_env})`)
   monitorarOcorrencias()
})

// 01: botCheckNovasNFs() => checkNovasNFs() => (SQL: NOTASFISCAIS_INICIADAS_JOB_INSERT)
// Inclui na fila se for lançada uma "NF" nova cuja o conhecimento esteja autorizado na SEFAZ
async function botCheckNovasNFs() {
      checkNovasNFs().then((ret)=>{
         if(ret.rowsAffected>0){
            notasFiscaisIncluidas++
            sendLog('AVISO',`Notas Fiscais - Incluidas (${ret.rowsAffected})`)
         }
         x_botCheckNovasNFs += ret.rowsAffected
      })
      ++checks
      setTimeout(botCheckNovasNFs,(check_time*2)) // (10000*2) = A cada 20 segundos
}

// 02: botGeraOcorrenciasIniciais() => geraOcorrenciasIniciais() => (SQL: TRACKING_INICIAL_JOB_INSERT)
// Inclui ocorrencias iniciais na fila 
async function botGeraOcorrenciasIniciais() {
      geraOcorrenciasIniciais().then((ret)=>{
         if(ret.rowsAffected>0){
            ocorrenciasIniciaisIncluidas++
            sendLog('AVISO',`Ocorrências Iniciais - Incluidas (${ret.rowsAffected})`)
         }
         x_botGeraOcorrenciasIniciais +=  ret.rowsAffected
      })      
      ++checks
      setTimeout(botGeraOcorrenciasIniciais,(check_time*3)) // (10000*3) = A cada 30 segundos
}

// 04: botRegistraManifestoNF() => registraManifestoNF()
// Registra Manifesto na NF
async function botRegistraManifestoNF() {
   registraManifestoNF().then((ret)=>{
      if(ret.rowsAffected>0){
         novosManifestosRegistrados++
         sendLog('AVISO',`Registro de novos manifestos - (${ret.rowsAffected})`)
      }
      x_botRegistraManifestoNF +=  ret.rowsAffected
   })      
   ++checks
   setTimeout(botRegistraManifestoNF,(check_time*6)) // (10000*6) = A cada 60 segundos
}

// 05: botGeraOcorrenciaSaidaDoCD() => geraOcorrenciaSaidaDoCD() => atualizaDataManifestoNF()
// Gera ocorrências de saida do CD (Transferências)
async function botGeraOcorrenciaSaidaDoCD() {
   await geraOcorrenciaSaidaDoCD().then((ret)=>{
      if(ret.rowsAffected>0){
         novasOcorrenciaSaidaDoCD++
         sendLog('AVISO',`Manifestos - Ocorrências de saída - (${ret.rowsAffected})`)
      }
      x_botGeraOcorrenciaSaidaDoCD +=  ret.rowsAffected
   })      
   await atualizaDataManifestoNF()
   ++checks
   setTimeout(botGeraOcorrenciaSaidaDoCD,check_time)
}

// 06: botGeraOcorrenciaChegadaFilDestino() => geraOcorrenciaChegadaFilDestino() => atualizaDataBaixaManifestoNF()
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
   ++checks
   setTimeout(botGeraOcorrenciaChegadaFilDestino,(check_time*6)) // (10000*6) = A cada 60 segundos
}

// 07: botGeraOcorrenciasTMS() => geraOcorrenciasTMS()
// Checa ocorrências geradas no CARGAS TMS e coloca na fila 
async function botGeraOcorrenciasTMS() {
   geraOcorrenciasTMS().then((ret)=>{
      if(ret.rowsAffected>0){
         novosOcorrenciasTMS++
         sendLog('AVISO',`Novos registros de ocorrencias no TMS - (${ret.rowsAffected})`)
      }
      x_botGeraOcorrenciasTMS +=  ret.rowsAffected
   })      
   ++checks
   setTimeout(botGeraOcorrenciasTMS,(check_time*3)) // (10000*3) = A cada 30 segundos
}

// 09: botCheckNovasEvidencias() => checkNovasEvidencias() => getEvidencias()
// Checa existencia de encerramentos e envia para API
async function botCheckNovasEvidencias() {
   checkNovasEvidencias(token).then((ret)=>{
      if(ret.rowsAffected>0){
         novosEncerramentos++
         sendLog('AVISO',`Verificando encerramento - (${ret.rowsAffected})`)
      }
      x_botCheckNovasEvidencias +=  ret.rowsAffected
   })      
   ++checks
   setTimeout(botCheckNovasEvidencias,(check_time*6)) // (10000*6) = A cada 60 segundos
}

// 10: botCeckNovosComprovantes() => checkNovosComprovantes() => getEvidencias()
// Checa existencia de comprovantes na Easydocs ou na AgileProcess e envia para API
async function botCheckNovosComprovantes() {
   checkNovosComprovantes(token).then((ret)=>{
      if(ret.rowsAffected>0){
         novosComprovantes++
         sendLog('AVISO',`Solicitado comprovantes na (Easydocs/AgileProcess) - (${ret.rowsAffected})`)
      }
      x_botCheckNovosComprovantes +=  ret.rowsAffected
   })      
   ++checks
   setTimeout(botCheckNovosComprovantes,time_evidencias) // (1800000) = A cada 30 minutos
}

// 08: botCheckEnviaOcorrencias() => checkEnviaOcorrencias() => sqlOcorrencias() => enviaOcorrencias()
// Envia ocorrencias de TRACKING
async function botCheckEnviaOcorrencias() {
   checkEnviaOcorrencias(id,token).then((ret)=>{
      if(ret.rowsAffected>0){
         ocorrenciasTracking++
         sendLog('AVISO',`Ocorrencias de tracking para enviar - (${ret.rowsAffected})`)
      }
      x_botCheckEnviaOcorrencias +=  ret.rowsAffected
   })      
   ++checks
   setTimeout(botCheckEnviaOcorrencias,(check_time*12)) // (10000*12) = A cada 120 segundos
}

// 03: botGetNFsNaoValidadas() => getNFsNaoValidadas() => getCargaAPIitrack() => registraCargaNF()
// Valida na API a NF para o destinatario e registra id.Carga
async function botGetNFsNaoValidadas() {
   getNFsNaoValidadas().then((notas)=>{
      if(notas.length==0 || notas.length == undefined) {
         return
      }              
      notas.map((nota)=>{      
         let danfe     = nota.DANFE
         if(INSERT_CARGA){
            insertCargaNaAPI(danfe).then(ret=>{
               let aviso = ret.success && ret.update ? 'SUCESSO' : 'AVISO'
               sendLog(aviso, ret.message)
            }).catch(err=>{
               sendLog('WARNING',`Insert - (Validação Falhou) - DANFE: ${danfe}, Mensagem: ${err}`)
            })
         } else {
            get_idCargaPK_DANFE(danfe).then(ret=>{
               let aviso = ret.success && ret.update ? 'SUCESSO' : 'AVISO'
               sendLog(aviso, `"DANFE: ${danfe}",  Sucesso API: ${ret.success}`)
            }).catch(err=>{
               sendLog('WARNING',`Pesquisa idCargaPK - Falhou - DANFE: ${danfe}, Mensagem: ${err}`)
            })
         }
      })

   })
   ++checks
   setTimeout(botGetNFsNaoValidadas,(check_time*6)) // (10000*6) = A cada 60 segundos
}

// Monitor de ocorrências - disparo inicial dos Bot´s
async function monitorarOcorrencias() {

      displayStatistics()

      botCheckNovasNFs()                          // 01: NOTASFISCAIS_INICIADAS_JOB_INSERT.sql
      botGeraOcorrenciasIniciais()                // 02: TRACKING_INICIAL_JOB_INSERT.sql
      botGetNFsNaoValidadas()                     // 03: NOTASFISCAIS_NAO_VALIDADAS.sql  &&  UPDATE_CARGA_NF.sql
      botRegistraManifestoNF()                    // 04: UPDATE_MANIFESTO_NF.sql
      botGeraOcorrenciaSaidaDoCD()                // 05: OCORRENCIA_SAIDA_DO_CD.sql  &&  UPDATE_DATA_MANIFESTO_NF.sql
      botGeraOcorrenciaChegadaFilDestino()        // 06: OCORRENCIA_BAIXA_CHEG_FIL_DESTINO.sql  &&  UPDATE_DATA_BAIXA_NF.sql
      botGeraOcorrenciasTMS()                     // 07: OCORRENCIAS_CARGAS.sql
      botCheckEnviaOcorrencias()                  // 08: OCORRENCIAS_PENDENTES.sql  &&  UPDATE_TRACKING.sql
      setTimeout(botCheckNovasEvidencias,40000)   // 09: COMPROVANTES_PENDENTES.sql  &&  UPDATE_EVIDENCIA_NF.sql
      setTimeout(botCheckNovosComprovantes,80000) // 10: COMPROVANTES_PENDENTES.sql  &&  UPDATE_EVIDENCIA_NF.sql
      
}
