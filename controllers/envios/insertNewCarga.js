// insertNewCarga.js
// Response: { "success": true,"data": 0 } <- idCargaPK

const loadAPI              = require('../../services/loadAPI')
const getMontaCargaDanfeDB = require('../loads/getMontaCargaDanfeDB')

const method   = 'POST'
const endpoint = '/User/Carga/Danfe'
const server   =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const insertNewCarga = async (danfe) => {
    let monta   = await getMontaCargaDanfeDB(danfe)
    let params  = monta.data[0]
    let ret     = await loadAPI(method,endpoint,server,params)
    return ret
}
module.exports = insertNewCarga
