const { parseISO } = require('date-fns') 
const { zonedTimeToUtc } = require('date-fns-tz')

let d = new Date().toISOString()
console.log(d)

const parsedDate = parseISO( d )
const znDate = zonedTimeToUtc(parsedDate, 'America/Sao_Paulo')

console.log(parsedDate)
console.log(znDate)

const crypto = require("crypto");

sha1 = crypto.createHash("sha1").update("TERMACO789", "binary").digest("hex") 

//without:
sha2 = crypto.createHash("sha1").update("TERMACO789").digest("hex") 


console.log(sha1)
console.log(sha2)


