import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ReservaForm } from '@/components/reservas/ReservaForm'
import { Card, CardContent } from '@/components/ui/Card'
import { Cabana, Cliente, Reserva } from '@/types'

export default async function EditarReservaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: reserva }, { data: cabanas }, { data: clientes }] = await Promise.all([
    supabase.from('reservas').select('*').eq('id', id).single(),
    supabase.from('cabanas').select('*').eq('activa', true).order('nombre'),
    supabase.from('clientes').select('*').order('apellido'),
  ])

  if (!reserva) notFound()

  return (
    <div className="max-w-2xl">
      <Header title="Editar reserva" subtitle="Modificá los datos de la reserva" />
      <Card>
        <CardContent className="pt-6">
          <ReservaForm
            reserva={reserva as Reserva}
            cabanas={(cabanas ?? []) as Cabana[]}
            clientes={(clientes ?? []) as Cliente[]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
