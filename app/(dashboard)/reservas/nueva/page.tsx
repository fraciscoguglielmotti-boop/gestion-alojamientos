import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { ReservaForm } from '@/components/reservas/ReservaForm'
import { Card, CardContent } from '@/components/ui/Card'
import { Cabana, Cliente } from '@/types'

export default async function NuevaReservaPage() {
  const supabase = await createClient()

  const [{ data: cabanas }, { data: clientes }] = await Promise.all([
    supabase.from('cabanas').select('*').eq('activa', true).order('nombre'),
    supabase.from('clientes').select('*').order('apellido'),
  ])

  return (
    <div className="max-w-2xl">
      <Header title="Nueva reserva" subtitle="Completá los datos para crear una reserva" />
      <Card>
        <CardContent className="pt-6">
          <ReservaForm
            cabanas={(cabanas ?? []) as Cabana[]}
            clientes={(clientes ?? []) as Cliente[]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
