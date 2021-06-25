SELECT TOP 1
     CONCAT(NFR1.EMP_CODIGO,NFR1.CNH_SERIE,NFR1.CNH_CTRC)  AS content_observacao,
     NFR1.EMP_CODIGO                                       AS content_sigla,
	 NFR1.NF                                               AS content_nroNotaFiscal,
	 1                                                     AS content_centroDeCusto_nro,
	 'LOGISTICA'                                           AS content_centroDeCusto_nome,
	 CNH1.CHAVECTE                                         AS content_cte,
	 CNH1.SERIE                                            AS content_serialNumber,
	 CIDREM.UF                                             AS content_embarcador_endereco_uf,
	 CIDREM.NOME                                           AS content_embarcador_endereco_cidade,
	 REMET.ENDERECO                                        AS content_embarcador_endereco_logradouro,
	 REMET.BAIRRO                                          AS content_embarcador_endereco_bairro,
	 REMET.NUMERO                                          AS content_embarcador_endereco_nro,
	 REMET.CEP                                             AS content_embarcador_endereco_cep,
	 REMET.CGCCPF                                          AS content_embarcador_responsavel_cnpj,
	 REMET.NOME                                            AS content_embarcador_responsavel_nome,
	 CIDDES.UF                                             AS content_destinatario_endereco_uf,
	 CIDDES.NOME                                           AS content_destinatario_endereco_cidade,
	 DESTIN.ENDERECO                                       AS content_destinatario_endereco_logradouro,
	 DESTIN.BAIRRO                                         AS content_destinatario_endereco_bairro,
	 DESTIN.NUMERO                                         AS content_destinatario_endereco_nro,
	 DESTIN.CEP                                            AS content_destinatario_endereco_cep,
	 DESTIN.NOME                                           AS content_destinatario_nome,
	 DESTIN.CGCCPF                                         AS content_destinatario_cpfCnpj, 
	 CIDTRA.UF                                             AS content_transportador_endereco_uf,
	 CIDTRA.NOME                                           AS content_transportador_endereco_cidade,
	 TRANSP.ENDERECO                                       AS content_transportador_endereco_logradouro,
	 TRANSP.BAIRRO                                         AS content_transportador_endereco_bairro,
	 TRANSP.NUMERO                                         AS content_transportador_endereco_nro,
	 TRANSP.CEP                                            AS content_transportador_endereco_cep,
	 TRANSP.FONE                                           AS content_transportador_responsavel_telefone,
	 TRANSP.CGC                                            AS content_transportador_responsavel_cnpj,
	 TRANSP.NOME                                           AS content_transportador_responsavel_nomeFantasia,
	 'TERMACO LOGISTICA'                                   AS content_transportador_responsavel_nome,
	 NFR1.CHAVENFE                                         AS content_danfe,
	 FORMAT(NFR1.DATA,'yyyy-MM-ddThh:mm:ss-03')            AS content_dataEmissaoDanfe,
	 CIDCLI.UF                                             AS content_endereco_uf,
	 CIDCLI.NOME                                           AS content_endereco_cidade,
	 CLIEMI.ENDERECO                                       AS content_endereco_logradouro,
	 CLIEMI.BAIRRO                                         AS content_endereco_bairro,
	 CLIEMI.NUMERO                                         AS content_endereco_nro,
	 CLIEMI.CEP                                            AS content_endereco_cep,
	 CONCAT(NFR1.EMP_CODIGO,NFR1.CNH_SERIE,NFR1.CNH_CTRC)  AS content_xpedido,
	 FORMAT(CNH1.PREVENTREGA,'yyyy-MM-ddThh:mm:ss-03')     AS content_dataPrevisao,
	 TOKEN.TOKEN                                           AS token
FROM CARGASSQL.dbo.NFR NFR1
JOIN CARGASSQL.dbo.CNH CNH1     ON CNH1.EMP_CODIGO=NFR1.EMP_CODIGO AND CNH1.SERIE=NFR1.CNH_SERIE AND CNH1.CTRC=NFR1.CNH_CTRC
JOIN CARGASSQL.dbo.CLI REMET    ON REMET.CGCCPF=CNH1.CLI_CGCCPF_REMET
JOIN CARGASSQL.dbo.CID CIDREM   ON CIDREM.CODIGO=REMET.CID_CODIGO
JOIN CARGASSQL.dbo.CLI DESTIN   ON DESTIN.CGCCPF=CNH1.CLI_CGCCPF_DEST
JOIN CARGASSQL.dbo.CID CIDDES   ON CIDDES.CODIGO=DESTIN.CID_CODIGO
JOIN CARGASSQL.dbo.EMP TRANSP   ON TRANSP.CODIGO=CNH1.EMP_CODIGO
JOIN CARGASSQL.dbo.CID CIDTRA   ON CIDTRA.CODIGO=TRANSP.CID_CODIGO
JOIN CARGASSQL.dbo.CLI CLIEMI   ON CLIEMI.CGCCPF=CNH1.CLI_CGCCPF_REMET
JOIN CARGASSQL.dbo.CID CIDCLI   ON CIDCLI.CODIGO=CLIEMI.CID_CODIGO
JOIN SIC.dbo.TOKEN_ITRACK TOKEN ON TOKEN.CNPJ=TRANSP.CGC
WHERE CNH1.VALORNF>0
  AND NFR1.CHAVENFE = '${danfe}'
  