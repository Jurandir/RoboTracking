UPDATE FIS
SET FIS.DT_MANIFESTO = CURRENT_TIMESTAMP
FROM NOTAFISCAL FIS
JOIN TRACKING TRK ON  TRK.DANFE         = FIS.DANFE AND
                      TRK.ID_OCORRENCIA = 302
WHERE FIS.DT_MANIFESTO IS NULL 