'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Cabana, Cliente, Reserva, ReservaEstado } from '@/types'
import { calcularTotal, formatMoneda, calcularNoches } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface ReservaFormProps {
  cabanas: Cabana[]
  clientes: Cliente[]
  reserva?: Reserva  // si se pasa, es edición
  onSuccess?: () => void
}

export function ReservaForm({ cabanas, clientes, reserva, onSuccess }: ReservaFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    cliente_id:    reserva?.cliente_id    ?? '',
    cabana_id:     reserva?.cabana_id     ?? '',
    fecha_inicio:  reserva?.fecha_inicio  ?? '',
    fecha_fin:     reserva?.fecha_fin     ?? '',
    estado:        reserva?.estado        ?? 'pendiente' as ReservaEstado,
    adultos:       reserva?.adultos       ?? 2,
    ninos:         reserva?.ninos         ?? 0,
    notas:         reserva?.notas         ?? '',
  })

  const cabanaSeleccionada = cabanas.find(c => c.id === form.cabana_id)
  const noches = form.fecha_inicio && form.fecha_fin ? calcularNoches(form.fecha_inicio, form.fecha_fin) : 0
  const totalEstimado = cabanaSeleccionada && noches > 0
    ? calcularTotal(cabanaSeleccionada.precio_noche, form.fecha_inicio, form.fecha_fin)
    : null

  function set(key: string, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (noches <= 0) { setError('La fecha de salida debe ser posterior a la de llegada'); return }

    setLoading(true)
    const payload = { ...form, precio_total: totalEstimado }

    const { error: dbError } = reserva
      ? await supabase.from('reservas').update(payload).eq('id', reserva.id)
      : await supabase.from('reservas').insert(payload)

    setLoading(false)
    if (dbError) { setError(dbError.message); return }

    onSuccess?.()
    router.push('/reservas')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Cliente */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Cliente</label>
          <select
            required
            value={form.cliente_id}
            onChange={e => set('cliente_id', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccionar cliente...</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.apellido}, {c.nombre} — {c.telefono}</option>
            ))}
          </select>
        </div>

        {/* Cabaña */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Alojamiento</label>
          <select
            required
            value={form.cabana_id}
            onChange={e => set('cabana_id', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccionar alojamiento...</option>
            {cabanas.filter(c => c.activa).map(c => (
              <option key={c.id} value={c.id}>{c.nombre} — {formatMoneda(c.precio_noche)}/noche</option>
            ))}
          </select>
        </div>

        {/* Fechas */}
        <Input
          label="Fecha de llegada"
          type="date"
          required
          value={form.fecha_inicio}
          onChange={e => set('fecha_inicio', e.target.value)}
        />
        <Input
          label="Fecha de salida"
          type="date"
          required
          value={form.fecha_fin}
          min={form.fecha_inicio}
          onChange={e => set('fecha_fin', e.target.value)}
        />

        {/* Huéspedes */}
        <Input
          label="Adultos"
          type="number"
          min={1}
          max={20}
          value={form.adultos}
          onChange={e => set('adultos', parseInt(e.target.value))}
        />
        <Input
          label="Niños"
          type="number"
          min={0}
          max={10}
          value={form.ninos}
          onChange={e => set('ninos', parseInt(e.target.value))}
        />

        {/* Estado */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Estado</label>
          <select
            value={form.estado}
            onChange={e => set('estado', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
            <option value="completada">Completada</option>
          </select>
        </div>

        {/* Notas */}
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Notas internas</label>
          <textarea
            rows={3}
            value={form.notas}
            onChange={e => set('notas', e.target.value)}
            placeholder="Ej: llegan tarde, necesitan cuna..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Resumen de precio */}
      {totalEstimado !== null && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-indigo-700">
            {noches} noche{noches !== 1 ? 's' : ''} × {formatMoneda(cabanaSeleccionada!.precio_noche)}
          </p>
          <p className="text-lg font-bold text-indigo-900">{formatMoneda(totalEstimado)}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {reserva ? 'Guardar cambios' : 'Crear reserva'}
        </Button>
      </div>
    </form>
  )
}
