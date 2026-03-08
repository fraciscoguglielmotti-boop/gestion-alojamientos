import { Header } from '@/components/layout/Header'
import { WhatsAppPanel } from '@/components/automatizaciones/WhatsAppPanel'

export default function AutomatizacionesPage() {
  return (
    <div className="max-w-3xl">
      <Header
        title="Automatizaciones WhatsApp"
        subtitle="Mensajes automáticos para tus huéspedes"
      />
      <WhatsAppPanel />
    </div>
  )
}
