SELECT 
      FIS.*,EMP.CGC CNPJ_USER,TKN.VALIDO,TKN.TOKEN
 FROM NOTAFISCAL FIS
 JOIN CARGASSQL.dbo.EMP on EMP.CODIGO = substring(FIS.DOCUMENTO,1,3)
 JOIN SIC.dbo.TOKEN_ITRACK TKN on TKN.CNPJ = EMP.CGC
WHERE 
      IDCARGA> 0 and COMPROVANTE_ENVIADO=0 
      AND ( 
            (PROTOCOLO = 'Erro inesperado, tente novamente mais tarde, Err:00') OR
            (PROTOCOLO = 'Não OK., Err:00') 
      )
ORDER BY 
      IDCARGA      
