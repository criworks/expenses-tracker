import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import { fetchGastosPorMes } from '../services/api'

export interface Gasto {
  id: string | number
  monto: number
  monto_formateado: string
  item: string
  categoria: string
  fecha: string
  metodo: string
}

export interface CategoriaInfo {
  total: number
  cantidad: number
}

export interface DatosResponse {
  ok: boolean
  cantidad: number
  total: number
  totalFormateado: string
  datos: Gasto[]
}

export function useGastos() {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [datos, setDatos] = useState<DatosResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchGastos = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true)
    try {
      const json = await fetchGastosPorMes(mes)
      if (json.ok) setDatos(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [mes])

  // Recarga cada vez que el tab recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchGastos()
    }, [fetchGastos])
  )

  const porCategoria = datos?.datos?.reduce((acc: Record<string, CategoriaInfo>, g: Gasto) => {
    const cat = g.categoria || 'Sin categoría'
    if (!acc[cat]) acc[cat] = { total: 0, cantidad: 0 }
    acc[cat].total += g.monto
    acc[cat].cantidad += 1
    return acc
  }, {}) ?? {}

  const categorias = Object.entries(porCategoria).sort(
    (a, b) => b[1].total - a[1].total
  )

  
  const totalMes = datos?.total ?? 0

  return {
    mes,
    setMes,
    datos,
    loading,
    refreshing,
    fetchGastos,
    categorias,
    totalMes,
  }
}
