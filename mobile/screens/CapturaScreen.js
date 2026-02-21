import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native'

const API_URL = 'https://expenses-tracker-deploy.up.railway.app'

const CAMPOS = [
  { key: 'monto', placeholder: 'monto', keyboardType: 'numeric' },
  { key: 'item', placeholder: 'qué', keyboardType: 'default' },
  { key: 'categoria', placeholder: 'categoría', keyboardType: 'default' },
  { key: 'fecha', placeholder: 'cuándo', keyboardType: 'default' },
]

export default function CapturaScreen() {
  const [valores, setValores] = useState({ monto: '', item: '', categoria: '', fecha: '' })
  const [metodo, setMetodo] = useState('TC')
  const [estado, setEstado] = useState('idle')
  const [mensaje, setMensaje] = useState('')
  const refs = useRef({})

  function handleChange(key, val) {
    setValores(prev => ({ ...prev, [key]: val }))
  }

  function handleSubmitEditing(key) {
    const keys = CAMPOS.map(c => c.key)
    const idx = keys.indexOf(key)
    if (idx < keys.length - 1) {
      refs.current[keys[idx + 1]]?.focus()
    }
  }

  function buildInput() {
    return [valores.monto, valores.item, valores.categoria, valores.fecha, metodo].join(', ')
  }

  async function handleGuardar() {
    if (!valores.monto || !valores.item) return

    setEstado('loading')
    setMensaje('')

    try {
      const res = await fetch(`${API_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: buildInput() }),
      })
      const json = await res.json()

      if (json.ok) {
        setEstado('ok')
        setMensaje(`${json.datos.montoFormateado} · ${json.datos.categoria}`)
        setValores({ monto: '', item: '', categoria: '', fecha: '' })
        setMetodo('TC')
        setTimeout(() => refs.current['monto']?.focus(), 100)
        setTimeout(() => {
          setEstado('idle')
          setMensaje('')
        }, 4000)
      } else {
        setEstado('error')
        setMensaje(json.errores?.[0] ?? 'error al guardar')
        setTimeout(() => setEstado('idle'), 4000)
      }
    } catch {
      setEstado('error')
      setMensaje('no se pudo conectar con la api')
      setTimeout(() => setEstado('idle'), 4000)
    }
  }

  const listo = valores.monto && valores.item

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>expenses</Text>

        <View style={styles.campos}>
          {CAMPOS.map((campo, i) => (
            <View key={campo.key} style={styles.campoRow}>
              <Text style={styles.campoLabel}>{campo.placeholder}</Text>
              <TextInput
                ref={el => (refs.current[campo.key] = el)}
                style={styles.input}
                value={valores[campo.key]}
                onChangeText={val => handleChange(campo.key, val)}
                onSubmitEditing={() => handleSubmitEditing(campo.key)}
                placeholder="—"
                placeholderTextColor="#2a2a2a"
                keyboardType={campo.keyboardType}
                returnKeyType={i < CAMPOS.length - 1 ? 'next' : 'done'}
                autoFocus={i === 0}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          ))}

          <View style={styles.campoRow}>
            <Text style={styles.campoLabel}>método</Text>
            <TouchableOpacity
              onPress={() => setMetodo(m => (m === 'TC' ? 'EF' : 'TC'))}
              activeOpacity={0.7}
            >
              <Text style={styles.toggle}>{metodo}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleGuardar}
          disabled={!listo || estado === 'loading'}
          style={[styles.btn, (!listo || estado === 'loading') && styles.btnDisabled]}
          activeOpacity={0.7}
        >
          {estado === 'loading' ? (
            <ActivityIndicator color="#666" size="small" />
          ) : (
            <Text style={[styles.btnText, !listo && styles.btnTextDisabled]}>guardar</Text>
          )}
        </TouchableOpacity>

        {estado === 'ok' && <Text style={styles.feedbackOk}>{mensaje}</Text>}
        {estado === 'error' && <Text style={styles.feedbackError}>{mensaje}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  scroll: { flexGrow: 1, paddingHorizontal: 32, paddingTop: 80, paddingBottom: 60 },
  header: {
    color: '#333',
    fontSize: 11,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginBottom: 56,
  },
  campos: { marginBottom: 48 },
  campoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    paddingVertical: 18,
  },
  campoLabel: {
    color: '#333',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    width: 90,
  },
  input: {
    flex: 1,
    color: '#e8e8e8',
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'right',
    padding: 0,
  },
  toggle: { color: '#666', fontSize: 20, fontWeight: '300', letterSpacing: 2 },
  btn: { borderWidth: 1, borderColor: '#333', paddingVertical: 14, alignItems: 'center' },
  btnDisabled: { borderColor: '#1a1a1a' },
  btnText: { color: '#888', fontSize: 11, letterSpacing: 6, textTransform: 'uppercase' },
  btnTextDisabled: { color: '#2a2a2a' },
  feedbackOk: {
    color: '#4a7c59',
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 24,
  },
  feedbackError: {
    color: '#663333',
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 24,
  },
})
