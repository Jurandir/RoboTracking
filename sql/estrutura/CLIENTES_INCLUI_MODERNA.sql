USE [SIC]
GO

INSERT INTO [dbo].[CLIENTES]
           ([CNPJ_CLI]
           ,[SERVIDOR]
           ,[LOGIN]
           ,[SENHA]
           ,[URL_OCORRENCIA]
           ,[URL_OCORRENCIA_SIMPLIFICADA]
           ,[URL_OCORRENCIA_CLIENTE]
           ,[URL_EVIDENCIAR_OCORRENCIA]
           ,[CHAVE_PUBLICA]
           ,[REF_LAYOUT])
     VALUES
           ('05075152'
           ,'https://www.itrackbrasil.com.br/ws'
           ,'11552312000710'
           ,'TERMACO789'
           ,''
           ,''
           ,''
           ,''
           ,''
           ,2)

GO

-- 28/12/2020
UPDATE CLIENTES
SET SERVIDOR = 'https://www.itrackbrasil.com.br/ws',
    LOGIN = '11552312000710',
    SENHA = 'TERMACO789'
WHERE CNPJ_CLI='05075152'
;

-- 27/11/2020
UPDATE CLIENTES
SET SERVIDOR = 'https://www.itrackbrasil.com.br/ws',
    LOGIN = '11552312000710',
    SENHA = 'TERMACO789'
WHERE CNPJ_CLI='62136304'
;