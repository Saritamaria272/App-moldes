'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2, AlertCircle, CheckCircle2, User, ClipboardList, Activity, MessageSquare, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'

export default function AuditV2Page() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [formData, setFormData] = useState({
        responsable: '',
        proceso: '',
        pregunta: '',
        respuesta: '',
        comentarios: '',
        fecha_auditoria: new Date().toISOString().slice(0, 16) // Format for datetime-local
    })

    useEffect(() => {
        const storedUser = localStorage.getItem('moldapp_user')
        if (!storedUser) {
            router.push('/login')
            return
        }
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        
        // Auto-fill responsible if not set
        setFormData(prev => ({
            ...prev,
            responsable: parsedUser.Nombre || parsedUser.NombreCompleto || ''
        }))
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const supabase = createClient()
            
            const { error } = await supabase
                .from('auditoria_registro')
                .insert([{
                    responsable: formData.responsable,
                    proceso: formData.proceso,
                    pregunta: formData.pregunta,
                    respuesta: formData.respuesta,
                    comentarios: formData.comentarios,
                    fecha_auditoria: formData.fecha_auditoria
                }])

            if (error) throw error

            setMessage({ type: 'success', text: 'Auditoría registrada exitosamente.' })
            
            // Reset form but keep responsible
            setFormData({
                responsable: user.Nombre || user.NombreCompleto || '',
                proceso: '',
                pregunta: '',
                respuesta: '',
                comentarios: '',
                fecha_auditoria: new Date().toISOString().slice(0, 16)
            })
        } catch (error: any) {
            console.error('Error saving audit:', error)
            setMessage({ type: 'error', text: 'Hubo un error al registrar la auditoría.' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <Navbar 
                user={user} 
                showBackButton 
                backPath="/dashboard" 
                title="Auditoría V2" 
                subtitle="Registro de Auditoría Final" 
            />

            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600/10 rounded-[2rem] flex items-center justify-center border border-blue-500/20 shadow-xl shadow-blue-500/10">
                                <ClipboardList className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                                    Control de <span className="text-blue-500">Auditoría</span>
                                </h1>
                                <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] mt-1">Management Standards System</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <form id="auditoria_form" onSubmit={handleSubmit} className="glass-card bg-white/50 dark:bg-black/20 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden p-8 lg:p-12 space-y-10">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Responsable */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <User className="w-3 h-3 text-blue-500" /> Responsable del Proceso
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Nombre del responsable..."
                                    className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl py-5 px-8 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:text-gray-400 dark:placeholder:text-gray-700"
                                    value={formData.responsable}
                                    onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                                />
                            </div>

                            {/* Fecha */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-blue-500" /> Fecha de Auditoría
                                </label>
                                <input
                                    required
                                    type="datetime-local"
                                    className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl py-5 px-8 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                                    value={formData.fecha_auditoria}
                                    onChange={(e) => setFormData({ ...formData, fecha_auditoria: e.target.value })}
                                />
                            </div>

                            {/* Proceso */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-blue-500" /> Proceso Auditado
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Especifique el proceso..."
                                    className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl py-5 px-8 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all uppercase placeholder:text-gray-400 dark:placeholder:text-gray-700"
                                    value={formData.proceso}
                                    onChange={(e) => setFormData({ ...formData, proceso: e.target.value })}
                                />
                            </div>

                            {/* Pregunta */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <ClipboardList className="w-3 h-3 text-blue-500" /> Pregunta / Requisito
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ingrese la pregunta..."
                                    className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl py-5 px-8 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700"
                                    value={formData.pregunta}
                                    onChange={(e) => setFormData({ ...formData, pregunta: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Respuesta */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-blue-500" /> Respuesta Final
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Describa la respuesta obtenida..."
                                className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl py-5 px-8 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700"
                                value={formData.respuesta}
                                onChange={(e) => setFormData({ ...formData, respuesta: e.target.value })}
                            />
                        </div>

                        {/* Comentarios */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <MessageSquare className="w-3 h-3 text-blue-500" /> Comentarios Adicionales
                            </label>
                            <textarea
                                className="w-full bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-[2rem] py-6 px-8 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all h-40 resize-none placeholder:text-gray-700"
                                placeholder="Observaciones técnicas o notas de campo..."
                                value={formData.comentarios}
                                onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                            />
                        </div>

                        {/* Messages */}
                        {message && (
                            <div className={`p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-600/10 border-green-500/20 text-green-500' : 'bg-red-600/10 border-red-500/20 text-red-500'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                <p className="font-bold text-sm uppercase tracking-wider">{message.text}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-8 rounded-[3rem] transition-all flex items-center justify-center gap-6 shadow-[0_20px_80px_rgba(37,99,235,0.4)] active:scale-[0.98] uppercase tracking-[0.5em] text-xs"
                            >
                                {saving ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Save className="w-7 h-7" /> Registrar Auditoría Final</>}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
