'use client'
import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, parseISO, addMonths, subMonths, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Reserva } from '@/types'
import { ESTADO_CONFIG } from '@/lib/utils'
import Link from 'next/link'

interface CalendarioReservasProps {
  reservas: Reserva[]
}

const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

export function CalendarioReservas({ reservas }: CalendarioReservasProps) {
  const [mes, setMes] = useState(new Date())
  const [selected, setSelected] = useState<Date | null>(null)

  const inicio = startOfMonth(mes)
  const fin = endOfMonth(mes)
  const dias = eachDayOfInterval({ start: inicio, end: fin })

  // Offset para empezar en lunes (0=lu)
  const offset = (getDay(inicio) + 6) % 7

  function reservasDia(dia: Date) {
    return reservas.filter(r => {
      const ri = parseISO(r.fecha_inicio)
      const rf = parseISO(r.fecha_fin)
      return isWithinInterval(dia, { start: ri, end: rf }) || isSameDay(dia, ri) || isSameDay(dia, rf)
    })
  }

  const selectedReservas = selected ? reservasDia(selected) : []

  return (
    <div className="space-y-4">
      {/* Navegación de mes */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMes(m => subMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-sm font-semibold text-slate-800 capitalize">
          {format(mes, 'MMMM yyyy', { locale: es })}
        </h3>
        <button
          onClick={() => setMes(m => addMonths(m, 1))}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Grilla de días */}
      <div className="grid grid-cols-7 gap-1">
        {DIAS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
        ))}

        {/* Celdas vacías de offset */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {dias.map(dia => {
          const reservasDiaActual = reservasDia(dia)
          const isSelected = selected && isSameDay(dia, selected)
          const isHoy = isSameDay(dia, new Date())

          return (
            <button
              key={dia.toISOString()}
              onClick={() => setSelected(prev => prev && isSameDay(prev, dia) ? null : dia)}
              className={`
                relative rounded-lg p-1.5 text-center text-xs transition-colors
                ${isSelected ? 'bg-indigo-600 text-white' : isHoy ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-slate-50 text-slate-700'}
              `}
            >
              <span>{format(dia, 'd')}</span>
              {reservasDiaActual.length > 0 && (
                <span className={`
                  block mx-auto mt-0.5 w-1 h-1 rounded-full
                  ${isSelected ? 'bg-white' : 'bg-indigo-400'}
                `} />
              )}
            </button>
          )
        })}
      </div>

      {/* Reservas del día seleccionado */}
      {selected && (
        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            {format(selected, "d 'de' MMMM", { locale: es })}
          </p>
          {selectedReservas.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Sin reservas este día</p>
          ) : (
            <div className="space-y-2">
              {selectedReservas.map(r => (
                <Link
                  key={r.id}
                  href={`/reservas/${r.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors"
                >
                  <div className="w-2 h-full min-h-[36px] rounded-full bg-indigo-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {r.cliente?.nombre} {r.cliente?.apellido}
                    </p>
                    <p className="text-xs text-slate-500">{r.cabana?.nombre}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_CONFIG[r.estado].color}`}>
                    {ESTADO_CONFIG[r.estado].label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
