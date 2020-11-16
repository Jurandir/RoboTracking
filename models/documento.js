
const documento ={
    content: {
        observacao: "",
        dataInicioEntrega: "",
        fotosComprovantes: [],
        centroDeCusto: {
            nro: 0,
            nome: ""
        },
        qtdPaleteRetirado: 0,
        idResponsavelCriadorFk: 0,
        longitudeEntrega: 0,
        outroDocumentoRecebedor: "",
        rgRecebedor: "",
        nomeRecebedor: "",
        checkListEntregas: [
            {
                idCheckListEntregaPk: 0,
                idResponsavelCriadorFk: 0,
                tipoCheckList: {
                    idTipoChecklistEntregaPk: 0,
                    descricao: "",
                    ativo: true
                },
                idOcorrenciaExterna: 0,
                descricao: "",
                ativo: true,
                ehEditavel: true,
                msgEdicao: ""
            }
        ],
    danfe: "",
    nroCte: "",
    idSucessoMotivo: 0,
    fotosOcorrencia: [],
    latitudeCheckIn: 0,
    dataEmissaoDanfe: "",
    codigoBarra: "",
    longitudeCheckIn: 0,
    distanciaParaDestinoEmMetros: 0,
    latitudeEntrega: 0,
    documentoRecebedor: "",
    qtdPaleteEntregue: 0,
    devolvida: true,
    duracaoParaDestinoEmSegundos: 0,
    dataFinalizacao: "",
    ocorrencia: {
      idResponsavelFk: 0,
      idOcorrenciaPk: 0
    },
    motorista: {
      tipoVeiculo: "",
      nome: "",
      placaVeiculo: ""
    },
    infoCargaAdicional: {
      horaFunc: "",
      escopoAtendimento: "",
      ramoAtividade: "",
      gestorComercial: "",
      nomeFantasia: "",
      contato: "",
      observacao: "",
      segmento: "",
      tipoInstalacao: "",
      ocorrencia: "",
      ocorrenciaManutencao: "",
      modeloInstalacao: "",
      telefoneAdicional: ""
    }
  },
  token: ""
}

module.exports = documento
