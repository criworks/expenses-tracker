import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const API_URL = 'https://expenses-tracker-deploy.up.railway.app'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const COLORES_CAT = {
  Básicos: '#4a7c59',
  Suscripciones: '#5b6fa6',
  Mercado: '#8a6d3b',
  Inversión: '#6b5b95',
  Ocio: '#a65b5b',
  Delivery: '#a67c52',
  Transporte: '#4a7a8a',
  'Sin categoría': '#444',
}

export default function DashboardScreen() {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function fetchGastos(isRefresh = false) {
    isRefresh ? setRefreshing(true) : setLoading(true)
    try {
      const res = await fetch(`${API_URL}/gastos?mes=${mes}`)
      const json = await res.json()
      if (json.ok) setDatos(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Recarga cada vez que el tab recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchGastos()
    }, [mes])
  )

  const porCategoria =
    datos?.datos?.reduce((acc, g) => {
      const cat = g.categoria || 'Sin categoría'
      if (!acc[cat]) acc[cat] = { total: 0, cantidad: 0 }
      acc[cat].total += g.monto
      acc[cat].cantidad += 1
      return acc
    }, {}) ?? {}

  const categorias = Object.entries(porCategoria).sort((a, b) => b[1].total - a[1].total)
  const totalMes = datos?.total ?? 0

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchGastos(true)}
          tintColor="#333"
        />
      }
    >
      {/* Header */}
      <Text style={styles.header}>expenses</Text>

      {/* Selector de mes */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mesesScroll}>
        {MESES.map((nombre, i) => {
          const num = i + 1
          const activo = mes === num
          return (
            <TouchableOpacity
              key={num}
              onPress={() => setMes(num)}
              style={styles.mesBtn}
              activeOpacity={0.7}
            >
              <Text style={[styles.mesBtnText, activo && styles.mesBtnActivo]}>{nombre}</Text>
              {activo && <View style={styles.mesIndicador} />}
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color="#333" style={{ marginTop: 48 }} />
      ) : !datos || datos.cantidad === 0 ? (
        <Text style={styles.vacio}>sin gastos este mes</Text>
      ) : (
        <>
          {/* Total */}
          <View style={styles.totalBlock}>
            <Text style={styles.totalLabel}>total {MESES[mes - 1]}</Text>
            <Text style={styles.totalMonto}>{datos.totalFormateado}</Text>
            <Text style={styles.totalCantidad}>{datos.cantidad} gastos</Text>
          </View>

          {/* Por categoría */}
          <View style={styles.seccion}>
            <Text style={styles.seccionLabel}>por categoría</Text>
            {categorias.map(([cat, info]) => {
              const pct = totalMes > 0 ? (info.total / totalMes) * 100 : 0
              const color = COLORES_CAT[cat] ?? '#444'
              return (
                <View key={cat} style={styles.catRow}>
                  <View style={styles.catHeader}>
                    <Text style={styles.catNombre}>{cat}</Text>
                    <Text style={styles.catMonto}>${info.total.toLocaleString('es-CL')}</Text>
                  </View>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
                  </View>
                </View>
              )
            })}
          </View>

          {/* Lista */}
          <View style={styles.seccion}>
            <Text style={styles.seccionLabel}>gastos</Text>
            {datos.datos.map(g => (
              <View key={g.id} style={styles.gastoRow}>
                <View style={styles.gastoIzq}>
                  <View
                    style={[styles.dot, { backgroundColor: COLORES_CAT[g.categoria] ?? '#444' }]}
                  />
                  <View>
                    <Text style={styles.gastoItem}>{g.item}</Text>
                    <Text style={styles.gastoMeta}>
                      {g.categoria} · {g.fecha}
                    </Text>
                  </View>
                </View>
                <View style={styles.gastoDer}>
                  <Text style={styles.gastoMonto}>{g.monto_formateado}</Text>
                  <Text style={styles.gastoMetodo}>{g.metodo}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  scroll: { paddingHorizontal: 24, paddingTop: 72, paddingBottom: 40 },
  header: {
    color: '#333',
    fontSize: 11,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginBottom: 32,
  },

  mesesScroll: { marginBottom: 40, marginHorizontal: -24, paddingHorizontal: 24 },
  mesBtn: { marginRight: 20, alignItems: 'center' },
  mesBtnText: { color: '#333', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' },
  mesBtnActivo: { color: '#e8e8e8' },
  mesIndicador: { width: 4, height: 1, backgroundColor: '#666', marginTop: 4 },

  vacio: {
    color: '#333',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 48,
  },

  totalBlock: { marginBottom: 40 },
  totalLabel: {
    color: '#444',
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  totalMonto: { color: '#e8e8e8', fontSize: 36, fontWeight: '300', letterSpacing: -1 },
  totalCantidad: { color: '#444', fontSize: 11, marginTop: 4 },

  seccion: { marginBottom: 40 },
  seccionLabel: {
    color: '#444',
    fontSize: 10,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 20,
  },

  catRow: { marginBottom: 16 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catNombre: { color: '#888', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' },
  catMonto: { color: '#e8e8e8', fontSize: 13, fontWeight: '300' },
  barBg: { height: 1, backgroundColor: '#1a1a1a', width: '100%' },
  barFill: { height: 1 },

  gastoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#161616',
  },
  gastoIzq: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  gastoItem: { color: '#ccc', fontSize: 14, fontWeight: '300' },
  gastoMeta: { color: '#333', fontSize: 11, marginTop: 2 },
  gastoDer: { alignItems: 'flex-end' },
  gastoMonto: { color: '#e8e8e8', fontSize: 14, fontWeight: '300' },
  gastoMetodo: { color: '#333', fontSize: 11, marginTop: 2 },
})
