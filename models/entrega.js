const formata_tzOffset = require('../helpers/formata_tzOffset')

const entrega = (token,dados,imagem) => {
    const ret = { 
        content: {
            observacao: 'ENTREGA REALIZADA',
            dataInicioEntrega: formata_tzOffset( dados.DATAINICIOENTREGA ),
            fotosComprovantes: [ imagem ],
            nomeRecebedor: dados.NOMERECEBEDOR,
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
        token: token
    }

    return ret
}

module.exports = entrega