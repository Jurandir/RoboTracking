UPDATE TRACKING
SET DT_ENVIO      = CURRENT_TIMESTAMP,
    QTD_REENVIO   = QTD_REENVIO + ${params.reenvio},
	RET_MENSAGEM  = '${params.mensagem}',
	RET_PROTOCOLO = '${params.protocolo}',
	RET_SUCESSO   = '${params.sucesso}'
WHERE DANFE       = '${params.danfe}'
