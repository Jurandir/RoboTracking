const crypto = require("crypto")

const login = async (cnpj,pwd) => {
    return {
    "account": cnpj,
    "password": crypto.createHash("sha1").update(pwd).digest("hex"),
    "type": 2
}}

module.exports = login