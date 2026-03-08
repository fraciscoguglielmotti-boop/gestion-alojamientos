import Link from 'next/link'
import { Reserva } from '@/types'
import { formatFecha, ESTADO_CONFIG } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { CalendarDays } from 'lucide-react'

interface ProximasReservasProps {
  reservas: Reserva[]
}

export function ProximasReservas({ reservas }: ProximasReservasProps) {
  if (reservas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <CalendarDays size={32} className="mb-2 opacity-40" />
        <p className="text-sm">No hay reservas próximas</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reservas.map((r) => {
        const estadoConf = ESTADO_CONFIG[r.estado]
        const variantMap: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
          confirmada: 'success',
          pendiente:  'warning',
          cancelada:  'danger',
          completada: 'neutral',
        }
        return (
          <Link
            key={r.id}
            href={`/reservas/${r.id}`}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm shrink-0">
              {r.cliente?.nombre?.[0]}{r.cliente?.apellido?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {r.cliente?.nombre} {r.cliente?.apellido}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {r.cabana?.nombre} · {formatFecha(r.fecha_inicio, 'dd MMM')} – {formatFecha(r.fecha_fin, 'dd MMM')}
              </p>
            </div>
            <Badge variant={variantMap[r.estado]}>{estadoConf.label}</Badge>
          </Link>
        )
      })}
    </div>
  )
}
