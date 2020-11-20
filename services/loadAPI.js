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

        return { dados : ret.data, isErr: false, isAxiosError: ret.isAxiosError || false }

    } catch (err) { 

        dados = {err, isErr: true, url: url, isAxiosError: true } 
        sendLog('ERRO', JSON.stringify(dados) )
        return dados
    }
}

module.exports = loadAPI
