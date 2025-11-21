import { CheckCircle, Clock, XCircle } from "lucide-react"

export const StatusBadge = ({ status, className = "" }) => {
  const statusConfig = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      Icon: Clock,
    },
    approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      Icon: CheckCircle,
    },
    rejected: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      Icon: XCircle,
    },
  }

  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.Icon

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <Icon className="w-4 h-4" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default StatusBadge
