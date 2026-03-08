import { Header } from '@/components/layout/Header'
import { ClienteForm } from '@/components/clientes/ClienteForm'
import { Card, CardContent } from '@/components/ui/Card'

export default function NuevoClientePage() {
  return (
    <div className="max-w-2xl">
      <Header title="Nuevo cliente" subtitle="Registrá un nuevo huésped" />
      <Card>
        <CardContent className="pt-6">
          <ClienteForm />
        </CardContent>
      </Card>
    </div>
  )
}
