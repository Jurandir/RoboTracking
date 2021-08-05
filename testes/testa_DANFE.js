const sqlQuery      = require('../connection/sqlQuery')
const sqlExec       = require('../connection/sqlExec')

const lista = require('./csvjson.json')

let a=0

async function verDanfe () {
    let ireg = 0
    let ibas = 0
    let iupd = 0
    let iIns = 0

    for await ( itn of lista ) {
        
        let danfe   = itn.danfe
        let idCarga = itn.caIdCargaPk

        ireg++

        await sqlQuery(`SELECT * FROM SIC.dbo.NOTAFISCAL WHERE DANFE='${danfe}'`).then(ret=>{
            let id1 =  ret.length > 0 ?  ret[0].DANFE : null
            let id2 =  ret.length > 0 ?  ret[0].IDCARGA : null             

            ibas++

            if(id1 && !id2) {
                let upd = retransmite(danfe,idCarga)
                iupd++
                console.log(`-<${a++}>`,itn.caIdCargaPk,itn.danfe,id1,id2)     
            }

            if(!id1 && !id2) {
                let upd = reinsert(danfe,idCarga)
                iIns++
                console.log(`+<${a++}>`,itn.caIdCargaPk,itn.danfe,id1,id2)     
            }

        })

    }

    console.log('Registros:',ireg)
    console.log('Na Base:',ibas)
    console.log('Update:',iupd)
    console.log('Insert:',iIns)

}

async function retransmite(danfe,idCarga) {
    let xsql = idCarga ? `,IDCARGA = ${idCarga}` : ''
    let sql = `UPDATE NOTAFISCAL
                SET DT_ATUAL = CURRENT_TIMESTAMP
                    ,DT_VALIDACAO = NULL
                    ,DANFE_API    = 'Re-Envio Habilitado.'
                    ,DT_UPDATE    = NULL
                    ${xsql}
                WHERE 
                DANFE = '${danfe}'`
    ret = await sqlExec(sql)
    console.log(`id: ${idCarga}, UPD:`,ret)

    return ret
}

async function reinsert(danfe,idCarga) {
    let sql = `
            INSERT INTO SIC.dbo.NOTAFISCAL ( IDCARGA, DANFE_API, DANFE, DOCUMENTO, CNPJ_EMITENTE, NUMERO , CNPJ_DESTINATARIO,DT_ATUAL, CNPJ_TRANSPORTADOR  )
            SELECT
                ${idCarga}                                                as IDCARGA,
                'Re-Insert'                                               as DANFE_API,
                NFR.CHAVENFE                                              as DANFE,
                CONCAT(CNH.EMP_CODIGO,CNH.SERIE,CNH.CTRC)                 as DOCUMENTO,
                SUBSTRING(isnull(NFR.CLI_CGCCPF_REMET,'')+CNH.CLI_CGCCPF_REMET,1,14) as CNPJ_EMITENTE,
                RIGHT(REPLICATE('0',7) + CAST(NFR.NF AS VARCHAR),7)       as NUMERO,
                CNH.CLI_CGCCPF_DEST                                       as CNPJ_DESTINATARIO,
                CNH.DATATU                                                as DT_ATUAL,
                EMP.CGC                                                   as CNPJ_TRANSPORTADOR
            FROM CARGASSQL.dbo.CNH
                JOIN CARGASSQL.dbo.EMP               ON EMP.CODIGO         = CNH.EMP_CODIGO
                JOIN CARGASSQL.dbo.NFR               ON NFR.EMP_CODIGO     = CNH.EMP_CODIGO	AND 
                                                        NFR.CNH_SERIE      = CNH.SERIE	AND 
                                                        NFR.CNH_CTRC       = CNH.CTRC -- AND CNH.NF LIKE ('%'+NFR.NF+'%')
                JOIN CARGASSQL.dbo.CTE               ON CTE.EMP_CODIGO_CNH = CNH.EMP_CODIGO	AND 
                                                        CTE.CNH_SERIE      = CNH.SERIE	AND 
                                                        CTE.CNH_CTRC       = CNH.CTRC											
                JOIN SIC.dbo.CLIENTES CLI            ON CLI.REF_LAYOUT = 2 AND (
                                                        CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_PAG,1,8)  OR 
                                                        CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_DEST,1,8) OR
                                                        CLI.CNPJ_CLI   = SUBSTRING(CNH.CLI_CGCCPF_REMET,1,8) )
                LEFT JOIN SIC.dbo.NOTAFISCAL NFE     ON NFE.DANFE      = NFR.CHAVENFE
                                                        
            WHERE 
                ISNULL(CNH.VALORNF,0)>0
            AND NOT EXISTS (SELECT 1 FROM SIC.dbo.NOTAFISCAL XXX WHERE XXX.DANFE = NFR.CHAVENFE)
            AND CTE.PROTOCOLOCTE IS NOT NULL
            AND NFE.DT_ATUAL IS NULL
            AND CNH.TIPO='C'
            AND CNH.STATUS = 'I'
            AND NFR.CHAVENFE = '${danfe}'
    `
    ret = await sqlExec(sql)
    console.log(`id: ${idCarga}, UPD:`,ret)

    return ret
}


verDanfe()

