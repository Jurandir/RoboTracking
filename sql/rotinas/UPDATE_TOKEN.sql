UPDATE TOKEN_ITRACK
SET VALIDO = ${obj.id},
    TOKEN    = '${obj.token}',
    DT_ATUAL = CURRENT_TIMESTAMP
WHERE CNPJ = '${obj.user}'
