import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { OcupacionBar } from '@/components/dashboard/OcupacionBar'
import { ProximasReservas } from '@/components/dashboard/ProximasReservas'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Reserva, Cabana } from '@/types'
import {
  CalendarDays, Users, TrendingUp, Home,
  LogIn, LogOut,
} from 'lucide-react'
import { formatMoneda, calcularNoches } from '@/lib/utils'
import { startOfMonth, endOfMonth, format, isToday, parseISO } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  const hoy = new Date()
  const inicioMes = format(startOfMonth(hoy), 'yyyy-MM-dd')
  const finMes = format(endOfMonth(hoy), 'yyyy-MM-dd')
  const hoyStr = format(hoy, 'yyyy-MM-dd')

  const [{ data: cabanas }, { data: reservas }, { data: reservasMes }] = await Promise.all([
    supabase.from('cabanas').select('*').eq('activa', true),
    supabase.from('reservas')
      .select('*, cliente:clientes(*), cabana:cabanas(*)')
      .in('estado', ['confirmada', 'pendiente'])
      .gte('fecha_fin', hoyStr)
      .order('fecha_inicio', { ascending: true })
      .limit(50),
    supabase.from('reservas')
      .select('precio_total, estado')
      .gte('fecha_inicio', inicioMes)
      .lte('fecha_inicio', finMes),
  ])

  const todasCabanas = (cabanas ?? []) as Cabana[]
  const todasReservas = (reservas ?? []) as Reserva[]

  // Métricas
  const cabanasOcupadas = todasCabanas.filter(c =>
    todasReservas.some(r =>
      r.cabana_id === c.id &&
      r.fecha_inicio <= hoyStr &&
      r.fecha_fin > hoyStr &&
      r.estado === 'confirmada'
    )
  ).length

  const ocupacionPct = todasCabanas.length > 0
    ? Math.round((cabanasOcupadas / todasCabanas.length) * 100)
    : 0

  const ingresosMes = (reservasMes ?? [])
    .filter(r => r.estado !== 'cancelada')
    .reduce((sum, r) => sum + (r.precio_total ?? 0), 0)

  const proximosCheckins = todasReservas.filter(r =>
    r.fecha_inicio === hoyStr || r.fecha_inicio === format(new Date(hoy.getTime() + 86400000), 'yyyy-MM-dd')
  ).length

  // Ocupación por cabaña (mes actual)
  const ocupacionPorCabana = todasCabanas.map(c => {
    const reservasCabana = todasReservas.filter(r => r.cabana_id === c.id)
    const noches = reservasCabana.reduce((sum, r) => sum + calcularNoches(r.fecha_inicio, r.fecha_fin), 0)
    const diasMes = endOfMonth(hoy).getDate()
    return {
      cabana: c.nombre,
      noches,
      porcentaje: Math.min(Math.round((noches / diasMes) * 100), 100),
    }
  }).sort((a, b) => b.porcentaje - a.porcentaje)

  // Próximas 5 reservas
  const proximas = todasReservas.slice(0, 5)

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle={`Resumen de ocupación — ${format(hoy, 'MMMM yyyy', { locale: undefined })}`}
      />

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Ocupación hoy"
          value={`${ocupacionPct}%`}
          subtitle={`${cabanasOcupadas} de ${todasCabanas.length} alojamientos`}
          icon={Home}
          color="indigo"
        />
        <MetricCard
          title="Reservas del mes"
          value={reservasMes?.length ?? 0}
          icon={CalendarDays}
          color="green"
        />
        <MetricCard
          title="Ingresos del mes"
          value={formatMoneda(ingresosMes)}
          icon={TrendingUp}
          color="yellow"
        />
        <MetricCard
          title="Check-ins próximos"
          value={proximosCheckins}
          subtitle="Hoy y mañana"
          icon={LogIn}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ocupación por cabaña */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">Ocupación por alojamiento</h2>
            <p className="text-xs text-slate-500 mt-0.5">Noches reservadas este mes</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {ocupacionPorCabana.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Sin datos de ocupación</p>
            ) : (
              ocupacionPorCabana.map(o => (
                <OcupacionBar key={o.cabana} {...o} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Próximas reservas */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">Próximas reservas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Confirmadas y pendientes</p>
          </CardHeader>
          <CardContent>
            <ProximasReservas reservas={proximas} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
