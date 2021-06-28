// teste rotina : "insertNewCarga.js"

require('dotenv').config()

const insertNewCarga  = require('./controllers/envios/insertNewCarga')
const registraCargaNF =  require('./controllers/atualizacoes/registraCargaNF')

let danfe = '35210605075152000843550010003297001582218238'

insertNewCarga(danfe).then((ret)=>{
    let msg       = 'Insert via Robô.'
    let retorno = {
        success: false,
        message: 'Retorno da API, não OK.',
        code: 0,
        idCargaPk: 0,
        danfe: danfe,
        data: {},
        update: false
    }
    if(ret.success) {
      retorno.data      = ret.dados
      retorno.success   = ret.dados.success
      retorno.idCargaPk = ret.dados.data

      if(retorno.success) {
        registraCargaNF(danfe, retorno.idCargaPk, msg).then((ok)=>{
          retorno.update  = (ok.rowsAffected>0)
          retorno.message = `SUCESSO (Inclusão CARGA) - idCargaPK: ${retorno.idCargaPk}, Danfe: ${danfe}, OK.`
          console.log('RET:',retorno)
        })   
      } else {
        retorno.code = ret.dados.code
        if(retorno.code==39){
          msg       = `DANFE Localizada. Code:${retorno.code}`
          registraCargaNF(danfe, retorno.idCargaPk, msg).then((ok)=>{
            retorno.update  = (ok.rowsAffected>0)
            retorno.success = retorno.update
            retorno.message = `SUCESSO (DANFE localizada na API) - idCargaPK: ${retorno.idCargaPk}, Danfe: ${danfe}, OK.`
            console.log('RET:',retorno)
          })   
        }
      }
    }
})


// node test_insertNewCarga.js

/* 
// 23210607197718000169550010001220251758977909
{
  success: true,
  dados: {
    success: false,
    message: 'A Danfe 23210607197718000169550010001220251758977909 não poderá ser utilizada, pois a mesma esta em andamento',
    data: 6377379,
    code: 39
  },
  isAxiosError: false,
  isErr: false
}

// 23210607197718000169550010001220261191660826
{
  success: true,
  dados: { success: true, data: 6377484 },
  isAxiosError: false,
  isErr: false
}


// 28210604067040000101550010000702731161962117
{
  success: true,
  dados: { success: true, data: 6377530 },
  isAxiosError: false,
  isErr: false
}


*/