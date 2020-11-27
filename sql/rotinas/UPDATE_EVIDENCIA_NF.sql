UPDATE NOTAFISCAL
   SET COMPROVANTE_ENVIADO = '${evidencia.enviado}',
       COMPROVANTE_ORIGEM  = '${evidencia.origem}',
       DT_ENVIO            = CURRENT_TIMESTAMP, 
       QTDE_LOAD           = QTDE_LOAD + ${evidencia.load},
       QTDE_SEND           = QTDE_SEND + ${evidencia.send},
       PROTOCOLO           = '${evidencia.protocolo}'
   WHERE
       DANFE = '${evidencia.danfe}' 