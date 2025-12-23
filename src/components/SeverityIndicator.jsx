import { FaExclamationCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

const SeverityIndicator = ({ severity = 'low', className = '' }) => {
  const severityConfig = {
    low: {
      label: 'Low Risk',
      color: 'green',
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
    },
    medium: {
      label: 'Moderate Risk',
      color: 'yellow',
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
    },
    high: {
      label: 'High Risk',
      color: 'red',
      icon: FaExclamationCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
    },
  }

  const config = severityConfig[severity] || severityConfig.low
  const Icon = config.icon

  return (
    <div className={`flex items-center space-x-3 ${config.bgColor} ${config.borderColor} border-2 rounded-xl p-4 shadow-md ${className}`}>
      <Icon className={`text-2xl ${config.textColor}`} />
      <div>
        <p className={`font-semibold ${config.textColor}`}>{config.label}</p>
        <p className={`text-sm ${config.textColor}/80`}>Severity Level: {severity.toUpperCase()}</p>
      </div>
    </div>
  )
}

export default SeverityIndicator


