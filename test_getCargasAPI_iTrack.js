const loadAPI              = require('./services/loadAPI')
const atualizaCargaITRECK  = require('./controllers/atualizacoes/atualizaCargaITRECK')
const getTokensValidosDB   = require('./controllers/loads/getTokensValidosDB')

require('dotenv').config()

const PAGE = 1
const TAMANHO = 1000

const method = 'GET'
const endpoint = '/User/CargaSimples'
const server =  (process.env.NODE_ENV=='Production') ? process.env.URL_PRODUCAO : process.env.URL_TESTE

function formataDataHoraDB(dt) {
    let ret = `${dt}`
    return ret.substr(0,4)+'-'+ret.substr(5,2)+'-'+ret.substr(8,2)+' '+ret.substr(11,8)
}

const getCargasAPIiTrack = async (params) => {
    return await loadAPI(method,endpoint,server,params)
}

getTokensValidosDB().then((ret)=>{
    
    console.log('Empresas: ',ret.length)

    ret.forEach((emp)=>{

        let params = {
            token: emp.TOKEN,
            cnpjEmbarcadorTransportador: emp.CNPJ,
            page: PAGE,
            limit: TAMANHO,
            ascending: false,
            orderBy:"dataCriacao"
        }

        getCargasAPIiTrack(params).then((ret)=>{

            if(ret==undefined || ret.dados==undefined) {
                console.log('RET:',ret)
                return
            }
        
            console.log(`${params.cnpjEmbarcadorTransportador} - `,ret.dados)
    
            if(ret.dados.success) {
                let lista = ret.dados.data.list
                lista.forEach(element => {
                    let a = {}
                    a.idCargaPk      = element.carga.idCargaPk
                    a.idStatusPk     = element.carga.status.idStatusPk
                    a.idSistemaPk    = element.carga.sistemaFinalizador.idSistemaPk
                    a.danfe          = element.carga.danfe
                    a.nroNotaFiscal  = element.carga.nroNotaFiscal
                    a.dataCriacao    = formataDataHoraDB(element.carga.dataCriacao)
                    a.destinatario   = element.carga.destinatario.cpfCnpj
                    a.embarcador     = element.carga.embarcador.responsavel.cnpj
                    a.transportador  = element.carga.transportador.responsavel.cnpj
                    atualizaCargaITRECK(a).then((res)=>{
                        console.log(PAGE,' , UpdateCARGA : ',res)
                    })
                })
        
            }
    
        })
    

    })


})
