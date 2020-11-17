const crypto = require("crypto")
const cnpj_responsavel = process.env.CNPJ_RESPONSAVEL || '11552312000710'
const pwd_responsavel  = process.env.PWD_RESPONSAVEL  || 'TERMACO789'

const login ={
    "account": cnpj_responsavel,
    "password": crypto.createHash("sha1").update(pwd_responsavel).digest("hex"),
    "type": 2
}

module.exports = login