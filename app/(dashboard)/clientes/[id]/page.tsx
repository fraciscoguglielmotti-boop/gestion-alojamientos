import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { ClienteForm } from '@/components/clientes/ClienteForm'
import { Card, CardContent } from '@/components/ui/Card'
import { Cliente } from '@/types'

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('clientes').select('*').eq('id', id).single()

  if (!data) notFound()

  return (
    <div className="max-w-2xl">
      <Header title="Editar cliente" subtitle={`${data.nombre} ${data.apellido}`} />
      <Card>
        <CardContent className="pt-6">
          <ClienteForm cliente={data as Cliente} />
        </CardContent>
      </Card>
    </div>
  )
}
