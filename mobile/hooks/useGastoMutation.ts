import { useState } from 'react'
import { CampoClave } from '../constants/theme'
import { crearGasto } from '../services/api'

export function useGastoMutation() {
  const [valores, setValores] = useState<Record<CampoClave, string>>({
    monto: '',
    item: '',
    categoria: '',
    fecha: '',
  })
  const [metodo, setMetodo] = useState('TC')
  const [estado, setEstado] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  const handleChange = (key: CampoClave, val: string) => {
    setValores(prev => ({ ...prev, [key]: val }))
  }

  const buildInput = () => {
    return [valores.monto, valores.item, valores.categoria, valores.fecha, metodo].join(', ')
  }

  const guardarGasto = async (onSuccessCallback?: () => void) => {
    if (!valores.monto || !valores.item) return

    setEstado('loading')
    setMensaje('')

    try {
      const json = await crearGasto(buildInput())

      if (json.ok) {
        setEstado('ok')
        setMensaje(`${json.datos.montoFormateado} · ${json.datos.categoria}`)
        setValores({ monto: '', item: '', categoria: '', fecha: '' })
        setMetodo('TC')
        
        if (onSuccessCallback) {
          onSuccessCallback()
        }

        setTimeout(() => {
          setEstado('idle')
          setMensaje('')
        }, 4000)
      }
    } catch (error) {
      setEstado('error')
      setMensaje(error instanceof Error ? error.message : 'no se pudo conectar con la api')
      setTimeout(() => setEstado('idle'), 4000)
    }
  }

  const listo = Boolean(valores.monto && valores.item)

  return {
    valores,
    metodo,
    setMetodo,
    estado,
    mensaje,
    handleChange,
    guardarGasto,
    listo,
  }
}
