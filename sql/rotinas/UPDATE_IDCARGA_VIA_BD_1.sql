update nf
set nf.IDCARGA = itk.IDCARGAPK,
    nf.DT_VALIDACAO = CURRENT_TIMESTAMP
from NOTAFISCAL nf
join CARGA_ITRACK itk on itk.DANFE = nf.DANFE
where nf.IDCARGA = 0
;

select * from NOTAFISCAL nf where nf.IDCARGA = 0 -- 1310 em 15/04/2021
;

select nf.*
from NOTAFISCAL nf
join CARGA_ITRACK itk on itk.DANFE = nf.DANFE
where nf.IDCARGA = 0
; -- 149 em 15/04/2021

select COUNT(*) qtde from CARGA_ITRACK -- 58658 em 15/04/2021

