INSERT INTO SIC.dbo.NOTAFISCAL ( DANFE, DOCUMENTO, CNPJ_EMITENTE, NUMERO , CNPJ_DESTINATARIO,DT_ATUAL )
SELECT   
	NFR.CHAVENFE                                              as DANFE,
	CONCAT(CNH.EMP_CODIGO,CNH.SERIE,CNH.CTRC)                 as DOCUMENTO,
	CNH.CLI_CGCCPF_REMET as CNPJ_EMITENTE,
	RIGHT(REPLICATE('0',7) + CAST(NFR.NF AS VARCHAR),7)       as NUMERO,
	CNH.CLI_CGCCPF_DEST                                       as CNPJ_DESTINATARIO,
	CNH.DATATU                                                as DT_ATUAL
FROM CARGASSQL.dbo.CNH
    JOIN CARGASSQL.dbo.NFR               ON NFR.EMP_CODIGO     = CNH.EMP_CODIGO	AND 
	                                        NFR.CNH_SERIE      = CNH.SERIE	AND 
											NFR.CNH_CTRC       = CNH.CTRC AND
											CNH.NF LIKE ('%'+NFR.NF+'%')
    JOIN CARGASSQL.dbo.CTE               ON CTE.EMP_CODIGO_CNH = CNH.EMP_CODIGO	AND 
	                                        CTE.CNH_SERIE      = CNH.SERIE	AND 
											CTE.CNH_CTRC       = CNH.CTRC											
	JOIN SIC.dbo.CLIENTES CLI            ON CLI.REF_LAYOUT = 2 AND (
	                                        CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_PAG,1,8)  OR 
											CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_DEST,1,8) OR
											CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_REMET,1,8) )
	LEFT JOIN SIC.dbo.NOTAFISCAL NFE     ON NFE.DANFE      = NFR.CHAVENFE

	JOIN TEMP_NF_MODERNA_2021_03_10 TMP  ON NFR.CHAVENFE = TMP.DANFE
	                                        
WHERE NFE.DT_ATUAL IS NULL 
  AND NFR.OBSEDI IS NOT NULL
  