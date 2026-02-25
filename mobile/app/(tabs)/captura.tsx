import { useRef } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { CAMPOS_CAPTURA as CAMPOS, CampoClave } from '../../constants/theme'
import { useGastoMutation } from '../../hooks/useGastoMutation'

export default function CapturaScreen() {
  const {
    valores,
    metodo,
    setMetodo,
    estado,
    mensaje,
    handleChange,
    guardarGasto,
    listo,
  } = useGastoMutation()

  const refs = useRef<Record<string, TextInput | null>>({})

  function handleSubmitEditing(key: CampoClave) {
    const keys = CAMPOS.map(c => c.key)
    const idx = keys.indexOf(key)
    if (idx < keys.length - 1) {
      refs.current[keys[idx + 1]]?.focus()
    }
  }

  const handleGuardar = () => {
    guardarGasto(() => {
      setTimeout(() => refs.current['monto']?.focus(), 100)
    })
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#111217]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-[24px] pt-[24px] pb-[24px]"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-[#60677D] text-[12px] tracking-[6px] uppercase mb-[24px]">
          expenses
        </Text>

        <View className="mb-[24px]">
          {CAMPOS.map((campo, i) => (
            <View
              key={campo.key}
              className="flex-row items-center justify-between border-b border-[#262A35] py-[16px]"
            >
              <Text className="text-[#60677D] text-[12px] tracking-[3px] uppercase w-[90px]">
                {campo.placeholder}
              </Text>
              <TextInput
                ref={el => { refs.current[campo.key] = el }}
                className="flex-1 text-white text-[24px] font-light text-right p-0"
                value={valores[campo.key]}
                onChangeText={val => handleChange(campo.key, val)}
                onSubmitEditing={() => handleSubmitEditing(campo.key)}
                placeholder="—"
                placeholderTextColor="#262A35"
                keyboardType={campo.keyboardType}
                returnKeyType={i < CAMPOS.length - 1 ? 'next' : 'done'}
                autoFocus={i === 0}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          ))}

          <View className="flex-row items-center justify-between border-b border-[#262A35] py-[16px]">
            <Text className="text-[#60677D] text-[12px] tracking-[3px] uppercase w-[90px]">
              método
            </Text>
            <Pressable onPress={() => setMetodo(m => (m === 'TC' ? 'EF' : 'TC'))}>
              <Text className="text-[#60677D] text-[24px] font-light tracking-[2px]">
                {metodo}
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleGuardar}
          disabled={!listo || estado === 'loading'}
          className={`border py-[16px] items-center ${
            !listo || estado === 'loading' ? 'border-[#262A35]' : 'border-[#60677D]'
          }`}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          {estado === 'loading' ? (
            <ActivityIndicator color="#60677D" size="small" />
          ) : (
            <Text
              className={`text-[12px] tracking-[6px] uppercase ${
                !listo ? 'text-[#262A35]' : 'text-[#60677D]'
              }`}
            >
              guardar
            </Text>
          )}
        </Pressable>

        {estado === 'ok' && (
          <Text className="text-[#4a7c59] text-[12px] tracking-[2px] text-center mt-[24px]">
            {mensaje}
          </Text>
        )}
        {estado === 'error' && (
          <Text className="text-[#a65b5b] text-[12px] tracking-[2px] text-center mt-[24px]">
            {mensaje}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
