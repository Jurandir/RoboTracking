SELECT FIS.*,FIS.CNPJ_TRANSPORTADOR CNPJ_USER,TKN.VALIDO,TKN.TOKEN 
FROM SIC.dbo.NOTAFISCAL FIS
JOIN SIC.dbo.TOKEN_ITRACK TKN on TKN.CNPJ = FIS.CNPJ_TRANSPORTADOR
WHERE FIS.DANFE ='${danfe}'