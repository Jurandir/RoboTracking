
    const dataNow = () =>{
        let data  = new Date()
        let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000)
        let dataBase = data2.toISOString().replace(/\.\d{3}Z$/, '')
        return dataBase
    }

    module.exports = dataNow
