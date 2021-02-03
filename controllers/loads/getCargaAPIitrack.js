const loadAPI = require('../../services/loadAPI')
// const querystring = require('querystring')

const method = 'GET'
const endpoint = '/User/CargaSimples'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

const padLeft = (nr, n, str) => {
    return Array(n-String(nr).length+1).join(str||'0')+nr
}

const getCargaAPIitrack = async (token,cnpj,nroFiscal,d_api) => {
    let CNPJ = cnpj
    let NF = nroFiscal

    try {
        CNPJ = padLeft( Number.parseInt(cnpj),14,'0' )
        NF   = (d_api=='(Validação Falhou)') ? `${Number.parseInt(nroFiscal)}` : nroFiscal
    } catch (err) {
        console.log('getCargaAPIitrack - ERRO: ',err)
        return { isErr:true }
    }

    //console.log('getCargaAPIitrack - CONFERENCIA: ',CNPJ,'=', cnpj, ',' , NF,'=', nroFiscal, '>>', d_api )

    let params = {
        token:  token ,
        cnpj: CNPJ,
        nroFiscal: NF
    }

    return await loadAPI(method,endpoint,server,params)

}

module.exports = getCargaAPIitrack