import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { CalendarioReservas } from '@/components/reservas/CalendarioReservas'
import { Reserva } from '@/types'
import { ESTADO_CONFIG, formatFecha, calcularNoches, formatMoneda } from '@/lib/utils'
import { Plus, Edit2, Eye } from 'lucide-react'

export default async function ReservasPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('reservas')
    .select('*, cliente:clientes(*), cabana:cabanas(*)')
    .order('fecha_inicio', { ascending: false })

  const reservas = (data ?? []) as Reserva[]

  return (
    <div>
      <Header
        title="Reservas"
        subtitle={`${reservas.length} reservas en total`}
        actions={
          <Link href="/reservas/nueva">
            <Button>
              <Plus size={16} />
              Nueva reserva
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Tabla */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-slate-800">Todas las reservas</h2>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Cliente', 'Alojamiento', 'Llegada', 'Salida', 'Noches', 'Total', 'Estado', ''].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {reservas.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                        No hay reservas. <Link href="/reservas/nueva" className="text-indigo-600 hover:underline">Crear la primera</Link>
                      </td>
                    </tr>
                  )}
                  {reservas.map(r => {
                    const estado = ESTADO_CONFIG[r.estado]
                    const variantMap: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
                      confirmada: 'success', pendiente: 'warning', cancelada: 'danger', completada: 'neutral',
                    }
                    const noches = calcularNoches(r.fecha_inicio, r.fecha_fin)
                    return (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {r.cliente?.nombre} {r.cliente?.apellido}
                            </p>
                            <p className="text-xs text-slate-400">{r.cliente?.telefono}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{r.cabana?.nombre}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{formatFecha(r.fecha_inicio, 'dd/MM/yy')}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{formatFecha(r.fecha_fin, 'dd/MM/yy')}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 text-center">{noches}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-800">
                          {r.precio_total ? formatMoneda(r.precio_total) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={variantMap[r.estado]}>{estado.label}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/reservas/${r.id}`}>
                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                              <Edit2 size={15} />
                            </button>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Calendario */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">Calendario</h2>
          </CardHeader>
          <CardContent>
            <CalendarioReservas reservas={reservas} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
