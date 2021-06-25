// teste rotina : "insertNewCarga.js"

require('dotenv').config()

const insertNewCarga = require('./controllers/envios/insertNewCarga')

let danfe = '23210607197718000169550010001220261191660826'

insertNewCarga(danfe).then((ret)=>{
    
    console.log(ret)

})



// node test_insertNewCarga.js

/* 
// 23210607197718000169550010001220251758977909
{
  success: true,
  dados: {
    success: false,
    message: 'A Danfe 23210607197718000169550010001220251758977909 não poderá ser utilizada, pois a mesma esta em andamento',
    data: 6377379,
    code: 39
  },
  isAxiosError: false,
  isErr: false
}

// 23210607197718000169550010001220261191660826
{
  success: true,
  dados: { success: true, data: 6377484 },
  isAxiosError: false,
  isErr: false
}
*/