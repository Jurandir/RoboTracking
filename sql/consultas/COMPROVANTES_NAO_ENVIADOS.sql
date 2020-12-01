SELECT 
    MEG.DATATU       AS DATAINICIOENTREGA,
	IME.DATABAIXAUSU AS DATAFINALIZACAO,
	NFR.DATA         AS DATAEMISSAODANFE,
	NFR.CHAVENFE     AS DANFE,
	CNH.CTRC         AS NROCTE,
	UPPER(IME.RECEBEDOR)    AS NOMERECEBEDOR,
	'N.INFO'         AS DOCUMENTORECEBEDOR,
	VEI.TIPO         AS TIPOVEICULO,
	ISNULL(MOT.NOME,'TERMACO') AS MOTORISTA,
	MEG.VEI_PLACA    AS PLACAVEICULO,
    FIS.DOCUMENTO    AS DOCUMENTO,     
    FIS.IDCARGA      AS IDCARGA         
FROM CARGASSQL.dbo.MEG
JOIN CARGASSQL.dbo.IME ON IME.EMP_CODIGO = MEG.EMP_CODIGO AND IME.MEG_CODIGO = MEG.CODIGO
JOIN CARGASSQL.dbo.CNH ON CNH.EMP_CODIGO = IME.EMP_CODIGO_CNH AND CNH.SERIE = IME.CNH_SERIE AND CNH.CTRC = IME.CNH_CTRC
JOIN CARGASSQL.dbo.NFR ON NFR.EMP_CODIGO = CNH.EMP_CODIGO AND NFR.CNH_SERIE = CNH.SERIE AND NFR.CNH_CTRC = CNH.CTRC
JOIN SIC.dbo.NOTAFISCAL FIS ON FIS.DANFE      = NFR.CHAVENFE
JOIN CARGASSQL.dbo.VEI ON VEI.PLACA = MEG.VEI_PLACA
LEFT JOIN CARGASSQL.dbo.MOT ON MOT.PRONTUARIO = MEG.MOT_PRONTUARIO
WHERE IME.ENTREGUE='S' AND NFR.CHAVENFE IS NOT NULL AND LEN(TRIM(NFR.CHAVENFE))> 0 AND FIS.COMPROVANTE_ENVIADO = 0 
  AND FIS.QTDE_SEND < 100 
  AND ( FIS.DT_ENVIO IS NULL OR DATEDIFF(minute,FIS.DT_ENVIO, CURRENT_TIMESTAMP) > 30)
ORDER BY NFR.CHAVENFE


