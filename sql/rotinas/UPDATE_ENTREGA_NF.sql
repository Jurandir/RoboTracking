UPDATE NOTAFISCAL
   SET COMPROVANTE_ENVIADO = '${evidencia.enviado}',
       DT_ENVIO            = CURRENT_TIMESTAMP, 
       PROTOCOLO           = '${evidencia.protocolo}'
   WHERE
       DANFE = '${evidencia.danfe}' 