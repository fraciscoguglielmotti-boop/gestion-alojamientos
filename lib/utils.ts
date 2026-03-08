import { type ClassValue, clsx } from 'clsx'
import { format, differenceInDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ReservaEstado } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatFecha(fecha: string | Date, formato = "d 'de' MMMM, yyyy") {
  const date = typeof fecha === 'string' ? parseISO(fecha) : fecha
  return format(date, formato, { locale: es })
}

export function formatMoneda(valor: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(valor)
}

export function calcularNoches(fechaInicio: string, fechaFin: string) {
  return differenceInDays(parseISO(fechaFin), parseISO(fechaInicio))
}

export function calcularTotal(precioNoche: number, fechaInicio: string, fechaFin: string) {
  const noches = calcularNoches(fechaInicio, fechaFin)
  return precioNoche * noches
}

export const ESTADO_CONFIG: Record<ReservaEstado, { label: string; color: string }> = {
  pendiente:   { label: 'Pendiente',   color: 'bg-yellow-100 text-yellow-800' },
  confirmada:  { label: 'Confirmada',  color: 'bg-green-100 text-green-800' },
  cancelada:   { label: 'Cancelada',   color: 'bg-red-100 text-red-800' },
  completada:  { label: 'Completada',  color: 'bg-slate-100 text-slate-700' },
}
