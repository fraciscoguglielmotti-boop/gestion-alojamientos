interface OcupacionBarProps {
  cabana: string
  porcentaje: number
  noches: number
}

export function OcupacionBar({ cabana, porcentaje, noches }: OcupacionBarProps) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-slate-600 w-32 shrink-0 truncate">{cabana}</p>
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all"
          style={{ width: `${Math.min(porcentaje, 100)}%` }}
        />
      </div>
      <p className="text-sm font-medium text-slate-700 w-10 text-right">{porcentaje}%</p>
      <p className="text-xs text-slate-400 w-16 text-right">{noches} noches</p>
    </div>
  )
}
