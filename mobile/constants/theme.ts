import { KeyboardTypeOptions } from 'react-native'

export const API_URL = 'https://expenses-tracker-deploy.up.railway.app'

export const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export const COLORES_CAT: Record<string, string> = {
  Básicos: '#4a7c59',
  Suscripciones: '#5b6fa6',
  Mercado: '#8a6d3b',
  Inversión: '#6b5b95',
  Ocio: '#a65b5b',
  Delivery: '#a67c52',
  Transporte: '#4a7a8a',
  'Sin categoría': '#444',
}

export const EMOJIS_CAT: Record<string, string> = {
  Básicos: '🏠',
  Mercado: '🛒',
  Suscripciones: '💳',
  Transporte: '🚌',
  Ocio: '☕️',
  Delivery: '💣',
  Inversión: '🌱',
  'Sin categoría': '💸',
}

export type CampoClave = 'monto' | 'item' | 'categoria' | 'fecha'

export const CAMPOS_CAPTURA: { key: CampoClave; placeholder: string; keyboardType: KeyboardTypeOptions }[] = [
  { key: 'monto', placeholder: 'monto', keyboardType: 'numeric' },
  { key: 'item', placeholder: 'qué', keyboardType: 'default' },
  { key: 'categoria', placeholder: 'categoría', keyboardType: 'default' },
  { key: 'fecha', placeholder: 'cuándo', keyboardType: 'default' },
]
