//-- Versão Atual em ( 24/11/2020 ) 
//-- By: Jurandir Ferreira
const colors = require('colors')

require('dotenv').config()

const displayDados                    = require('./helpers/displayDados')
const getCliente                      = require('./controllers/loads/getCliente')
const checkNovasNFs                   = require('./controllers/atualizacoes/checkNovasNFs')
const registraCargaNF                 = require('./controllers/atualizacoes/registraCargaNF')
const checkNovasEvidencias            = require('./controllers/envios/checkNovasEvidencias')
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
const getToken                        = require('./controllers/loads/getToken')
const sendLog                         = require('./helpers/sendLog')


const check_time                 = process.env.CHECK_TIME      || 10000   // mseg 
const time_evidencias            = process.env.TIME_EVIDENCIAS || 1800000 // mseg 
const node_env                   = process.env.NODE_ENV        || 'Test'  // Production / Developer 

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
let novosComprovantesEasedocs            = 0
let x_botCheckNovasNFs                   = 0
let x_botGeraOcorrenciasIniciais         = 0
let x_botGetNFsNaoValidadas              = 0
let x_botRegistraManifestoNF             = 0
let x_botGeraOcorrenciaSaidaDoCD         = 0
let x_botGeraOcorrenciaChegadaFilDestino = 0
let x_botGeraOcorrenciasTMS              = 0
let x_botCheckNovasEvidencias            = 0
let x_botCheckEnviaOcorrencias           = 0

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
      checks: checks,
      notasfiscais: x_botCheckNovasNFs || 0,
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
      ++checks
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
      ++checks
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
   ++checks
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
   ++checks
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
   ++checks
   setTimeout(botGeraOcorrenciaChegadaFilDestino,check_time)
}

// Gera Ocorrências do CARGAS TMS
async function botGeraOcorrenciasTMS() {
   geraOcorrenciasTMS().then((ret)=>{
      if(ret.rowsAffected>0){
         novosOcorrenciasTMS++
         sendLog('AVISO',`Novos registros de ocorrencias no TMS - (${ret.rowsAffected})`)
      }
      x_botGeraOcorrenciasTMS +=  ret.rowsAffected
   })      
   ++checks
   setTimeout(botGeraOcorrenciasTMS,check_time)
}

// Checa existencia de comprovantes na Easydocs
async function botCheckNovasEvidencias() {
   checkNovasEvidencias(token).then((ret)=>{
      if(ret.rowsAffected>0){
         novosComprovantesEasedocs++
         sendLog('AVISO',`Solicitado comprovantes na Easydocs - (${ret.rowsAffected})`)
      }
      x_botCheckNovasEvidencias +=  ret.rowsAffected
   })      
   ++checks
   setTimeout(botCheckNovasEvidencias,time_evidencias)
}


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
   setTimeout(botCheckEnviaOcorrencias,check_time)
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
            let count        = 0
            let isAxiosError = true

            isErr = ret.isErr || true
            if (isErr == false) {
               count          = ret.dados.data.count
               isAxiosError   = ret.isAxiosError
            }

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
   ++checks
   setTimeout(botGetNFsNaoValidadas,check_time)
}

// Monitor de ocorrências - disparo inicial dos Bot´s
async function monitorarOcorrencias() {
      //botCheckNovasNFs()                     // NOTASFISCAIS_INICIADAS_JOB_INSERT.sql
      //botGeraOcorrenciasIniciais()           // TRACKING_INICIAL_JOB_INSERT.sql
      //botGetNFsNaoValidadas()                // NOTASFISCAIS_NAO_VALIDADAS.sql  &&  UPDATE_CARGA_NF.sql
      //botRegistraManifestoNF()               // UPDATE_MANIFESTO_NF.sql
      //botGeraOcorrenciaSaidaDoCD()           // OCORRENCIA_SAIDA_DO_CD.sql  &&  UPDATE_DATA_MANIFESTO_NF.sql
      //botGeraOcorrenciaChegadaFilDestino()   // OCORRENCIA_BAIXA_CHEG_FIL_DESTINO.sql  &&  UPDATE_DATA_BAIXA_NF.sql
      //botGeraOcorrenciasTMS()                // OCORRENCIAS_CARGAS.sql
       botCheckNovasEvidencias()              // COMPROVANTES_PENDENTES.sql  &&  UPDATE_EVIDENCIA_NF.sql
      // botCheckEnviaOcorrencias()               // OCORRENCIAS_PENDENTES.sql  &&  UPDATE_TRACKING.sql
      displayStatistics()
}
