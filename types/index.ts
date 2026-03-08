export type CabanaTipo = 'cabana' | 'hosteria' | 'habitacion' | 'suite'
export type ReservaEstado = 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
export type AutomatizacionTipo = 'confirmacion' | 'recordatorio' | 'checkin' | 'checkout' | 'cancelacion' | 'personalizado'

export interface Cabana {
  id: string
  nombre: string
  tipo: CabanaTipo
  capacidad: number
  precio_noche: number
  descripcion: string | null
  activa: boolean
  created_at: string
}

export interface Cliente {
  id: string
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  dni: string | null
  notas: string | null
  created_at: string
  updated_at: string
}

export interface Reserva {
  id: string
  cliente_id: string
  cabana_id: string
  fecha_inicio: string
  fecha_fin: string
  estado: ReservaEstado
  precio_total: number | null
  notas: string | null
  adultos: number
  ninos: number
  created_at: string
  updated_at: string
  // joins
  cliente?: Cliente
  cabana?: Cabana
}

export interface Automatizacion {
  id: string
  nombre: string
  tipo: AutomatizacionTipo
  trigger_evento: string
  trigger_horas: number
  mensaje_template: string
  activa: boolean
  created_at: string
}

export interface MetricasDashboard {
  ocupacion_hoy: number
  cabanas_ocupadas: number
  cabanas_total: number
  reservas_mes: number
  ingresos_mes: number
  proximos_checkins: number
  proximos_checkouts: number
}
