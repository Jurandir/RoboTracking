UPDATE CARGA_ITRACK
   SET IDSTATUSPK     = '${idStatusPk}',
       IDSISTEMAPK    = '${idSistemaPk}',
       DANFE          = '${danfe}',
       NRONOTAFISCAL  = '${nroNotaFiscal}',
       DATACRIACAO    = '${dataCriacao}',
       DESTINATARIO   = '${destinatario}',
       EMBARCADOR     = '${embarcador}',
       TRANSPORTADOR  = '${transportador}',
       DATA_UPDATE    = CURRENT_TIMESTAMP
 WHERE IDCARGAPK      = '${idCargaPk}'
