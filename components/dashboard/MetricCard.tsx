import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  color?: 'indigo' | 'green' | 'yellow' | 'red'
}

const colorStyles = {
  indigo: { icon: 'bg-indigo-100 text-indigo-600', trend: 'text-indigo-600' },
  green:  { icon: 'bg-green-100 text-green-600',   trend: 'text-green-600' },
  yellow: { icon: 'bg-yellow-100 text-yellow-600', trend: 'text-yellow-600' },
  red:    { icon: 'bg-red-100 text-red-600',        trend: 'text-red-600' },
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend, color = 'indigo' }: MetricCardProps) {
  const styles = colorStyles[color]
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={cn('p-2.5 rounded-xl', styles.icon)}>
          <Icon size={22} />
        </div>
      </div>
      {trend && (
        <p className={cn('text-xs font-medium mt-3', styles.trend)}>
          {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  )
}
