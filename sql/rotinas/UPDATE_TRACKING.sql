UPDATE TRACKING
SET DT_ENVIO      = CURRENT_TIMESTAMP,
    QTD_REENVIO   = QTD_REENVIO + ${reenvio},
	RET_MENSAGEM  = '${mensagem}',
	RET_PROTOCOLO = '${protocolo}',
	RET_SUCESSO   = '${sucesso}'
WHERE DANFE       = '${danfe}',
