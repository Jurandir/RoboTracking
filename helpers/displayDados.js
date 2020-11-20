
const displayDados = ( params ) => {
    process.stdout.write(`\rNFs: ${params.notasfiscais}, Validadas: ${params.validadas},Ocorr: ${params.ocorrencias}, Use (Ctr-C) p/ Finalizar..${params.checks}..`.yellow)
}

module.exports = displayDados