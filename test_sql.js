/*
const getCargaITRACK = require('./controllers/loads/getCargaITRACK')
getCargaITRACK(0).then((ret)=>{
    console.log('*',ret)
})
*/

/*
const atualizaCargaITRECK = require('./controllers/atualizacoes/atualizaCargaITRECK')
let carga = {
    idCargaPk: 31492777,
    idStatusPk: 1,
    idSistemaPk: 0,
    danfe: '35210303470727001283550060048326961234405817',
    nroNotaFiscal: '4832696',
    dataCriacao: '2021-03-01 21:39:46',
    destinatario: '03457435000158',
    embarcador: '03470727001283',
    transportador: '11552312000710'
}
atualizaCargaITRECK(carga).then((ret)=>{
    console.log('*',ret)
})
*/

/*
const getTokensValidosDB = require('./controllers/loads/getTokensValidosDB')
getTokensValidosDB().then((ret)=>{
    console.log('*',ret)
})
*/

const atualizaBDidCargaNotaFiscal = require('./controllers/atualizacoes/atualizaBDidCargaNotaFiscal')
atualizaBDidCargaNotaFiscal().then((ret)=>{
    console.log('*',ret)
})

