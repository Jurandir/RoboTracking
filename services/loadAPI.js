const axios         = require('axios')
const sendLog       = require('../helpers/sendLog')

const loadAPI = async (method,endpoint,server,params) => {

    const config = {
        headers: { "Content-Type": 'application/json' }
    }
    let url = server + endpoint

    try {       
        if (method=='POST') {
            ret = await axios.post( url, params, config )
        } else {
            ret = await axios.get( url, { params }, config )
        }
        
        console.log('LOADAPI: status=',ret.status)
        console.log('LOADAPI: url=',url)
        console.log('LOADAPI: config.data=',ret.config.data)
        console.log('LOADAPI: data=',ret.data)

        return { dados : ret.data, isErr: false, isAxiosError: ret.isAxiosError || false }

    } catch (err) { 
        
        if (err.message) {
            dados = {url: url, err: err.message ,Err: true, isAxiosError: false } 
        } else {
           dados = {url: url, err ,Err: true, isAxiosError: true } 
           sendLog('ERRO', 'loadAPI: '+JSON.stringify(dados).substr(0,250) )
        }   
        return dados
    }
}

module.exports = loadAPI
