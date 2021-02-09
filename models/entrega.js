// Formata JSON para enviar para API

const formata_tzOffset = require('../helpers/formata_tzOffset')

const entrega = (token,dados) => {
    let nomeRecebedor = dados.NOMERECEBEDOR || 'RESPONSÁVEL NA ENTREGA'
    const ret = { 
        content: {
            observacao: 'ENTREGA REALIZADA',
            dataInicioEntrega: formata_tzOffset( dados.DATAINICIOENTREGA ),
            fotosComprovantes: [],
            nomeRecebedor: nomeRecebedor,
            danfe: dados.DANFE,
            nroCte: dados.NROCTE,
            idSucessoMotivo: 0,
            dataEmissaoDanfe: formata_tzOffset( dados.DATAEMISSAODANFE ),
            dataFinalizacao: formata_tzOffset( dados.DATAFINALIZACAO ),
            documentoRecebedor: dados.DOCUMENTORECEBEDOR,
            motorista: {
                tipoVeiculo: dados.TIPOVEICULO,
                nome: dados.MOTORISTA,
                placaVeiculo: dados.PLACAVEICULO,
            }		
        },
        token: dados.TOKEN
    }

    return ret
}

module.exports = entrega