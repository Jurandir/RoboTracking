
require('dotenv').config()

const getCargaAPIitrack = require('./controllers/loads/getCargaAPIitrack')

const token = '41YIzpld%2B3rFKIwbpy9g%2FNZI76UZKvpUR0jTVUSG%2FU4v7HjgpZLsfGJgzcHICjbZeS4g8sjqxGtVmHh4dx18L3MslHKgiYuf7WbwZ1UrRqr%2BJdwSwjI9T8dDL8g%2FYtzL'
const danfe = '23210607197718000169550010001220261191660826' // FOR - 

getCargaAPIitrack(token,danfe).then(ret =>{
    console.log('getCargaAPIitrack: RET:',ret)
})


// node test_getDANFE_CargaSimple.js


/*
// 23210607197718000169550010001220261191660826
server: http://beta.martinlabs.com.br/iTrackServer-1.0-SNAPSHOT/ws
getCargaAPIitrack: RET: {
  success: false,
  dados: null,
  url: 'http://beta.martinlabs.com.br/iTrackServer-1.0-SNAPSHOT/ws/User/CargaSimples',
  err: 'Request failed with status code 500',
  Err: true,
  isAxiosError: false,
  isErr: true
}
*/