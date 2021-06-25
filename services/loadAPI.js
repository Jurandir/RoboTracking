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
        
        return { success: true, dados : ret.data, isAxiosError: ret.isAxiosError || false , isErr: false }

    } catch (err) { 
        
        if (err.message) {
            dados = { success: false, dados:null ,url: url, err: err.message ,Err: true, isAxiosError: false, isErr: true } 
        } else {
            dados = { success: false, dados:null ,url: url, err ,Err: true, isAxiosError: true, isErr: true } 
            sendLog('ERRO', 'loadAPI: '+JSON.stringify(dados).substr(0,250) )
        }   
        return dados
    }
}

module.exports = loadAPI
