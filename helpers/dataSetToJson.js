// dataSetToJson.js
const dataSetToJson = (data) => {
        let retJson = []
        data.forEach(campos => {
            let newobj = {}
            for  ( let campo in campos ) {
                let elementos = `${campo}`.split('_')
                let len       = elementos.length
                
                if(len==1){ newobj[ elementos[0] ] = campos[campo]
                } else 
                if(len==2){ 
                    if(!newobj[ elementos[0] ]){ newobj[ elementos[0] ] = {} }
                        newobj[ elementos[0] ][ elementos[1] ] = campos[campo]
                } else
                if(len==3){
                    if(!newobj[ elementos[0] ]){ newobj[ elementos[0] ] = {} }
                    if(!newobj[ elementos[0] ][ elementos[1] ]){ newobj[ elementos[0] ][ elementos[1] ] = {} }
                        newobj[ elementos[0] ][ elementos[1] ][ elementos[2] ] = campos[campo]
                } else
                if(len==4){
                    if(!newobj[ elementos[0] ]){ newobj[ elementos[0] ] = {} }
                    if(!newobj[ elementos[0] ][ elementos[1] ]){ newobj[elementos[0] ][ elementos[1] ] = {} }
                    if(!newobj[ elementos[0] ][ elementos[1] ][ elementos[2] ]){ newobj[ elementos[0] ][ elementos[1] ][ elementos[2] ] = {} }
                        newobj[ elementos[0] ][ elementos[1] ][ elementos[2] ][ elementos[3] ] = campos[campo]
                } else
                if(len==5){
                    if(!newobj[ elementos[0] ]){ newobj[ elementos[0] ] = {} }
                    if(!newobj[ elementos[0] ][ elementos[1] ]){ newobj[ elementos[0] ][ elementos[1] ] = {} }
                    if(!newobj[ elementos[0] ][ elementos[1] ][ elementos[2] ]){ newobj[ elementos[0] ][ elementos[1] ][elementos[2] ] = {} }
                    if(!newobj[ elementos[0] ][ elementos[1] ][ elementos[2] ][ elementos[3] ]){ newobj[ elementos[0] ][elementos[1] ][ elementos[2] ][ elementos[3] ] = {} }
                        newobj[ elementos[0] ][ elementos[1] ][ elementos[2] ][ elementos[3] ][ elementos[4] ] = campos[campo]
                }
            }
            retJson.push(newobj)
        })
        return retJson
    }
module.exports = dataSetToJson