// PV_MOLDES V2.4
import { createClient } from '@/lib/supabase'

export interface RawMaterial {
    "Número de artículo SAP": string
    "Materia Prima": string
    "Unidad de medida de compras": string
    "Usuario"?: string
}

export interface ConsumptionRecord {
    id?: string
    materia_prima_nombre: string
    materia_prima_codigo: string
    materia_prima_id?: string
    unidad: string
    unidades: number
    tipo: string
    concepto: string
    molde_asociado_id?: string | number | null
    observaciones?: string
    created_at?: string
    created_by?: string
}

export const rawMaterialsService = {
    async getRawMaterials() {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('Materia prima moldes')
            .select('*')
            .order('Materia Prima', { ascending: true })

        if (error) {
            console.error('Error fetching raw materials:', error)
            return []
        }
        return data as RawMaterial[]
    },

    async saveConsumption(record: ConsumptionRecord) {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('consumo_materia_prima')
            .insert([record])
            .select()

        if (error) throw error
        return data[0]
    }
}
