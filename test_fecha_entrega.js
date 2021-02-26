const listaID             = require('./testes/listaIDs')
const getFechaEntregaID   = require('./controllers/loads/getFechaEntregaID')
const enviaEvidencias     = require('./services/enviaEvidencias')

require('dotenv').config()

let ind = listaID.length;

( async () => {


    for await (let id of listaID) {
            getFechaEntregaID(id).then( (dados)=> {
                --ind
                if(dados) {
                    let ind1 = ind
                    enviaEvidencias(dados.TOKEN,dados).then((ret)=>{
                        console.log('DADOS:')
                        console.log(`(${ind1} ) - ID:`,id,'Retorno:',ret,dados)
                    })
                } 
            })

    }
    
})()
