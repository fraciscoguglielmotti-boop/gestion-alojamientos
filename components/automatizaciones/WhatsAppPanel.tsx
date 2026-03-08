'use client'
import { useState } from 'react'
import { MessageSquare, Plus, ToggleLeft, ToggleRight, Edit2, Trash2, Zap } from 'lucide-react'
import { Automatizacion, AutomatizacionTipo } from '@/types'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'

const TIPO_CONFIG: Record<AutomatizacionTipo, { label: string; emoji: string }> = {
  confirmacion:  { label: 'Confirmación de reserva', emoji: '✅' },
  recordatorio:  { label: 'Recordatorio',             emoji: '⏰' },
  checkin:       { label: 'Check-in',                 emoji: '🏠' },
  checkout:      { label: 'Check-out',                emoji: '👋' },
  cancelacion:   { label: 'Cancelación',              emoji: '❌' },
  personalizado: { label: 'Personalizado',            emoji: '✏️' },
}

// Datos de demo para UI
const DEMO_AUTOMATIZACIONES: Automatizacion[] = [
  {
    id: '1',
    nombre: 'Bienvenida al confirmar',
    tipo: 'confirmacion',
    trigger_evento: 'reserva_confirmada',
    trigger_horas: 0,
    mensaje_template: 'Hola {{nombre}}! 🏡 Tu reserva en {{cabana}} está confirmada para el {{fecha_inicio}}. ¡Te esperamos!',
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    nombre: 'Recordatorio 24hs antes',
    tipo: 'recordatorio',
    trigger_evento: 'antes_checkin',
    trigger_horas: 24,
    mensaje_template: 'Hola {{nombre}}! 👋 Te recordamos que mañana es tu llegada a {{cabana}}. Horario de check-in: 15hs.',
    activa: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    nombre: 'Mensaje de check-out',
    tipo: 'checkout',
    trigger_evento: 'dia_checkout',
    trigger_horas: 8,
    mensaje_template: 'Buen día {{nombre}}! Esperamos que hayas disfrutado tu estadía. El check-out es hasta las 11hs. 🙏',
    activa: false,
    created_at: new Date().toISOString(),
  },
]

interface AutomatizacionCardProps {
  auto: Automatizacion
  onToggle: (id: string) => void
  onEdit: (auto: Automatizacion) => void
}

function AutomatizacionCard({ auto, onToggle, onEdit }: AutomatizacionCardProps) {
  const config = TIPO_CONFIG[auto.tipo]
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4">
      <div className="text-2xl">{config.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-slate-900">{auto.nombre}</p>
            <p className="text-xs text-slate-500 mt-0.5">{config.label}</p>
          </div>
          <Badge variant={auto.activa ? 'success' : 'neutral'}>
            {auto.activa ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>
        <div className="mt-3 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
          <p className="text-xs text-slate-600 font-mono leading-relaxed">{auto.mensaje_template}</p>
        </div>
        {auto.trigger_horas > 0 && (
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Zap size={12} />
            Se envía {auto.trigger_horas}hs antes del evento
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onToggle(auto.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title={auto.activa ? 'Desactivar' : 'Activar'}
        >
          {auto.activa ? <ToggleRight size={20} className="text-indigo-500" /> : <ToggleLeft size={20} />}
        </button>
        <button
          onClick={() => onEdit(auto)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export function WhatsAppPanel() {
  const [automatizaciones, setAutomatizaciones] = useState(DEMO_AUTOMATIZACIONES)
  const [editando, setEditando] = useState<Automatizacion | null>(null)
  const [showModal, setShowModal] = useState(false)

  function handleToggle(id: string) {
    setAutomatizaciones(prev => prev.map(a => a.id === id ? { ...a, activa: !a.activa } : a))
  }

  return (
    <div className="space-y-6">
      {/* Banner informativo */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <MessageSquare size={20} className="text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-900">Panel de automatizaciones WhatsApp</p>
          <p className="text-xs text-green-700 mt-1">
            Configurá mensajes automáticos que se enviarán a tus huéspedes en momentos clave.
            La integración con la API de WhatsApp Business estará disponible próximamente.
          </p>
        </div>
      </div>

      {/* Variables disponibles */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Variables disponibles en mensajes</p>
        <div className="flex flex-wrap gap-2">
          {['{{nombre}}', '{{apellido}}', '{{cabana}}', '{{fecha_inicio}}', '{{fecha_fin}}', '{{noches}}', '{{total}}'].map(v => (
            <code key={v} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-indigo-700">{v}</code>
          ))}
        </div>
      </div>

      {/* Header + botón */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          {automatizaciones.filter(a => a.activa).length} de {automatizaciones.length} activas
        </p>
        <Button size="sm" onClick={() => { setEditando(null); setShowModal(true) }}>
          <Plus size={16} />
          Nueva automatización
        </Button>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {automatizaciones.map(auto => (
          <AutomatizacionCard
            key={auto.id}
            auto={auto}
            onToggle={handleToggle}
            onEdit={a => { setEditando(a); setShowModal(true) }}
          />
        ))}
      </div>

      {/* Modal (UI demo) */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editando ? 'Editar automatización' : 'Nueva automatización'}
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <p className="text-sm text-yellow-800">
              🚧 Esta funcionalidad está en desarrollo. La integración con WhatsApp Business API estará disponible en la próxima versión.
            </p>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
