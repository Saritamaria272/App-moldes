
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Loader2, Package, Clock, Filter, AlertCircle } from 'lucide-react'
import { moldsService } from '@/services/molds.service'

export default function MoldsModule() {
    const [records, setRecords] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [defectFilter, setDefectFilter] = useState('')

    const fetchHistory = useCallback(async () => {
        setLoading(true)
        try {
            // Updated to fetch from the NEW table 'base_datos_historico_moldes'
            const data = await moldsService.getHistoryFromHistoricoTable(100, 0, searchQuery, {
                defecto: defectFilter,
                tipo_reparacion: typeFilter
            })
            setRecords(data || [])
        } catch (e) {
            console.error('Error loading history:', e)
        } finally {
            setLoading(false)
        }
    }, [searchQuery, defectFilter, typeFilter])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchHistory()
        }, 500)
        return () => clearTimeout(timer)
    }, [fetchHistory])

    const getStatusStyles = (st: string) => {
        const s = (st || '').toUpperCase()
        if (s.includes('REPARACION') || s.includes('PROCESO')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        if (s.includes('ESPERA')) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
        if (s.includes('ENTREGADO') || s.includes('OK')) return 'bg-green-500/10 text-green-400 border-green-500/20'
        return 'bg-white/5 text-gray-400 border-white/10'
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 p-4 md:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-3">
                        <Clock className="w-8 h-8 text-blue-500" />
                        Histórico de <span className="text-blue-500">Calidad</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">Trazabilidad histórica desde la nueva base de datos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-2xl border border-black/5 dark:border-white/5 relative group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        placeholder="Título o Código..."
                        className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <label className="absolute -top-2 left-6 px-2 bg-white dark:bg-[#0f172a] text-[9px] font-black text-blue-500 uppercase">Título / Código</label>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-black/5 dark:border-white/5 relative group">
                    <Filter className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        placeholder="Tipo de Reparación..."
                        className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    />
                    <label className="absolute -top-2 left-6 px-2 bg-white dark:bg-[#0f172a] text-[9px] font-black text-blue-500 uppercase">Tipo Reparación</label>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-black/5 dark:border-white/5 relative group">
                    <AlertCircle className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        placeholder="Defecto..."
                        className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 dark:text-white outline-none transition-all"
                        value={defectFilter}
                        onChange={(e) => setDefectFilter(e.target.value)}
                    />
                    <label className="absolute -top-2 left-6 px-2 bg-white dark:bg-[#0f172a] text-[9px] font-black text-blue-500 uppercase">Defecto</label>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em]">Consultando Base Histórica...</p>
                </div>
            ) : records.length > 0 ? (
                <div className="w-full overflow-x-auto rounded-[2.5rem] border border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 shadow-2xl glass-card relative">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Título</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Código</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Estado</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Tipo Rep.</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest min-w-[250px]">Defectos & Obs.</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Entrada</th>
                                <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Responsable</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {records.map((r, i) => (
                                <tr key={`${r.id}-${i}`} className="group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 align-middle font-bold text-slate-900 dark:text-white uppercase leading-tight text-xs">
                                        {r.titulo || 'S/N'}
                                    </td>
                                    <td className="p-6 align-middle">
                                        <span className="font-mono text-xs font-bold text-slate-500 uppercase">{r.codigo_molde || 'S/C'}</span>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${getStatusStyles(r.estado)}`}>
                                            {r.estado || 'SIN ESTADO'}
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className="bg-black/5 dark:bg-white/5 inline-flex px-3 py-1.5 rounded-full text-[9px] font-bold text-gray-500 uppercase whitespace-nowrap">
                                            {r.tipo_de_reparacion || 'Standard'}
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-red-500 font-bold line-clamp-1">{r.defectos_a_reparar || '--'}</p>
                                            <p className="text-[10px] text-gray-500 italic line-clamp-1">{r.observaciones || '--'}</p>
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className="font-mono text-xs font-bold text-slate-600 dark:text-gray-400">
                                            {r.fecha_entrada ? r.fecha_entrada.split('T')[0] : 'S/F'}
                                        </div>
                                    </td>
                                    <td className="p-6 align-middle">
                                        <div className="text-[10px] font-black text-slate-600 dark:text-gray-400">
                                            {r.responsable || 'N/A'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="py-40 text-center space-y-6 bg-black/5 dark:bg-white/[0.02] rounded-[3rem] border border-dashed border-black/10 dark:border-white/10">
                    <Package className="w-16 h-16 text-gray-300 mx-auto opacity-50" />
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm italic">
                        La tabla de histórico aún está en proceso de migración o no se encontraron resultados.
                    </p>
                </div>
            )}
        </div>
    )
}
