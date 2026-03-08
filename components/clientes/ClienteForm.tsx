'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Cliente } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface ClienteFormProps {
  cliente?: Cliente
  onSuccess?: () => void
}

export function ClienteForm({ cliente, onSuccess }: ClienteFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre:   cliente?.nombre   ?? '',
    apellido: cliente?.apellido ?? '',
    email:    cliente?.email    ?? '',
    telefono: cliente?.telefono ?? '',
    dni:      cliente?.dni      ?? '',
    notas:    cliente?.notas    ?? '',
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: dbError } = cliente
      ? await supabase.from('clientes').update(form).eq('id', cliente.id)
      : await supabase.from('clientes').insert(form)

    setLoading(false)
    if (dbError) { setError(dbError.message); return }

    onSuccess?.()
    router.push('/clientes')
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
        <Input
          label="Nombre"
          required
          value={form.nombre}
          onChange={e => set('nombre', e.target.value)}
          placeholder="Juan"
        />
        <Input
          label="Apellido"
          required
          value={form.apellido}
          onChange={e => set('apellido', e.target.value)}
          placeholder="Pérez"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          placeholder="juan@email.com"
        />
        <Input
          label="Teléfono / WhatsApp"
          value={form.telefono}
          onChange={e => set('telefono', e.target.value)}
          placeholder="+54 9 11 ..."
        />
        <Input
          label="DNI / Documento"
          value={form.dni}
          onChange={e => set('dni', e.target.value)}
          placeholder="30123456"
        />
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Notas</label>
          <textarea
            rows={3}
            value={form.notas}
            onChange={e => set('notas', e.target.value)}
            placeholder="Ej: cliente frecuente, prefiere cabaña grande..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {cliente ? 'Guardar cambios' : 'Crear cliente'}
        </Button>
      </div>
    </form>
  )
}
