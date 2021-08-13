UPDATE NOTAFISCAL
   SET COMPROVANTE_ENVIADO =   (CASE WHEN COMPROVANTE_ENVIADO = 2 AND '${evidencia.enviado}'='0' THEN 2 
                                     WHEN COMPROVANTE_ENVIADO = 1 AND '${evidencia.enviado}'='0' THEN 1 
                                     ELSE '${evidencia.enviado}' END ) 
       ,DT_ENVIO            = CURRENT_TIMESTAMP 
       ,PROTOCOLO           = '${evidencia.protocolo}'
   WHERE
       DANFE = '${evidencia.danfe}' 