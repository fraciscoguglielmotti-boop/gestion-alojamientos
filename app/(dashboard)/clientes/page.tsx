import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { Cliente } from '@/types'
import { formatFecha } from '@/lib/utils'
import { Plus, Edit2, Phone, Mail, User } from 'lucide-react'

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('clientes')
    .select('*')
    .order('apellido')

  const clientes = (data ?? []) as Cliente[]

  return (
    <div>
      <Header
        title="Clientes"
        subtitle={`${clientes.length} clientes registrados`}
        actions={
          <Link href="/clientes/nuevo">
            <Button>
              <Plus size={16} />
              Nuevo cliente
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clientes.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-20 text-slate-400">
            <User size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No hay clientes registrados.</p>
            <Link href="/clientes/nuevo" className="text-indigo-600 text-sm hover:underline mt-1">
              Agregar el primero
            </Link>
          </div>
        )}
        {clientes.map(c => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm flex items-center justify-center">
                  {c.nombre[0]}{c.apellido[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{c.apellido}, {c.nombre}</p>
                  {c.dni && <p className="text-xs text-slate-400">DNI: {c.dni}</p>}
                </div>
              </div>
              <Link href={`/clientes/${c.id}`}>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Edit2 size={15} />
                </button>
              </Link>
            </div>
            <div className="space-y-1.5">
              {c.email && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail size={13} />
                  <span className="truncate">{c.email}</span>
                </div>
              )}
              {c.telefono && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone size={13} />
                  <span>{c.telefono}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-3">
              Cliente desde {formatFecha(c.created_at, 'MMM yyyy')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
