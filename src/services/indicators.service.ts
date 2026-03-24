// PV_MOLDES V2.4
import { createClient } from '@/lib/supabase'

// ── Raw row from BD_moldes ────────────────────────────────────────────────────
export interface BDMoldRaw {
    id: number
    "Título": string | null
    "CODIGO MOLDE": string | null
    "FECHA ENTRADA": string | null
    "FECHA ESPERADA": string | null
    "FECHA ENTREGA": string | null
    "ESTADO": string | null
    "DEFECTOS A REPARAR": string | null
    "Tipo de reparacion": string | null
    "Tipo": string | null
    "Responsable": string | null
}

// ── Normalised row for the UI ─────────────────────────────────────────────────
export interface MoldIndicatorRow {
    id: number
    serial: string
    nombre_articulo: string
    fecha_esperada: string | null
    fecha_entrega: string | null
    estado: string
    tipo_de_reparacion: string
    tipo: string
}

// ── IndicatorStats includes both data sets ────────────────────────────────────
export interface IndicatorStats {
    // All records with FECHA ESPERADA in range (comprometidos set)
    comprometidos: MoldIndicatorRow[]
    // All records with FECHA ENTREGA in range (entregados set)
    entregados: MoldIndicatorRow[]
    // Kept for legacy compat
    detalles: MoldIndicatorRow[]
    totalComprometidas: number
    totalEntregadasATiempo: number
    totalPendientes: number
    nivelServicio: number
    desglosePorCategoria: Record<string, number>
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function mapRow(m: BDMoldRaw): MoldIndicatorRow {
    return {
        id:               m.id,
        serial:           m["CODIGO MOLDE"]      || '',
        nombre_articulo:  m["Título"]            || '',
        fecha_esperada:   m["FECHA ESPERADA"]    ?? null,
        fecha_entrega:    m["FECHA ENTREGA"]     ?? null,
        estado:           m["ESTADO"]            || 'PROCESO',
        tipo_de_reparacion: m["Tipo de reparacion"] || '',
        tipo:             m["Tipo"]              || '',
    }
}

function calcCategoryBreakdown(rows: MoldIndicatorRow[]): Record<string, number> {
    const cats: Record<string, number> = {
        REPARACION_RAPIDA: 0, REPARACION_ESPECIAL: 0,
        MOLDE_NUEVO: 0,       MODELO_NUEVO: 0,
    }
    rows.forEach(r => {
        const tr  = (r.tipo_de_reparacion || '').toUpperCase()
        const tip = (r.tipo               || '').toUpperCase()

        if (tip === 'MOLDE NUEVO')                              cats.MOLDE_NUEVO++
        else if (tr.includes('MODELO'))                         cats.MODELO_NUEVO++
        else if (tr.includes('RAPIDA') || tr.includes('RÁPIDA')) cats.REPARACION_RAPIDA++
        else if (tr.includes('ESPECIAL'))                       cats.REPARACION_ESPECIAL++
    })
    return cats
}

// ── Service ───────────────────────────────────────────────────────────────────
export const indicatorsService = {
    /**
     * Performs TWO independent queries:
     *   Set A – "comprometidos": FECHA ESPERADA in [start, end]
     *   Set B – "entregados":    FECHA ENTREGA  in [start, end]
     *
     * The service level is: |Set B| / |Set A| × 100
     * The table shown to the user is Set A (comprometidos), with their
     * fecha_entrega populated so each row can show Cumple/No cumple.
     */
    async getKPIs(dateRange: { start: string; end: string }): Promise<IndicatorStats> {
        const supabase = createClient()

        // ── Query A: comprometidos (by FECHA ESPERADA) ──────────────────────
        const { data: dataA, error: errA } = await supabase
            .from('BD_moldes')
            .select('*')
            .not('"FECHA ESPERADA"', 'is', null)
            .gte('"FECHA ESPERADA"', dateRange.start)
            .lte('"FECHA ESPERADA"', dateRange.end)
            .order('"FECHA ESPERADA"', { ascending: true })

        if (errA) {
            console.error('[Indicators] Error fetching comprometidos:', errA.message)
            throw errA
        }

        // ── Query B: entregados (by FECHA ENTREGA) ───────────────────────────
        const { data: dataB, error: errB } = await supabase
            .from('BD_moldes')
            .select('*')
            .not('"FECHA ENTREGA"', 'is', null)
            .gte('"FECHA ENTREGA"', dateRange.start)
            .lte('"FECHA ENTREGA"', dateRange.end)

        if (errB) {
            console.error('[Indicators] Error fetching entregados:', errB.message)
            throw errB
        }

        const comprometidosRaw = (dataA || []) as BDMoldRaw[]
        const entregadosRaw    = (dataB || []) as BDMoldRaw[]

        const comprometidos = comprometidosRaw.map(mapRow)
        const entregados    = entregadosRaw.map(mapRow)

        const totalComprometidas    = comprometidos.length
        const totalEntregadasATiempo = entregados.length
        const totalPendientes       = comprometidos.filter(r => !r.fecha_entrega).length
        const nivelServicio         = totalComprometidas > 0
            ? (totalEntregadasATiempo / totalComprometidas) * 100
            : 0

        return {
            comprometidos,
            entregados,
            detalles:              comprometidos, // table = comprometidos set
            totalComprometidas,
            totalEntregadasATiempo,
            totalPendientes,
            nivelServicio,
            desglosePorCategoria:  calcCategoryBreakdown(comprometidos),
        }
    },
}
