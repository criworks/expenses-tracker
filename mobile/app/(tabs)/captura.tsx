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
import { Feather } from '@expo/vector-icons'
import { useGastoMutation } from '../../hooks/useGastoMutation'
import { useGastos } from '../../hooks/useGastos'
import { CategorySelector } from '../../components/ui/CategorySelector'
import { PaymentMethodSelector } from '../../components/ui/PaymentMethodSelector'

export default function CapturaScreen() {
  const { fetchGastos } = useGastos()
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

  const montoRef = useRef<TextInput>(null)

  const handleAmountChange = (text: string) => {
    // Solo permitimos números
    const numericValue = text.replace(/[^0-9]/g, '')
    handleChange('monto', numericValue)
  }

  const handleGuardar = () => {
    guardarGasto(() => {
      fetchGastos(true)
      setTimeout(() => montoRef.current?.focus(), 100)
    })
  }

  // Formato con separadores de miles para Chile
  const formattedAmount = valores.monto 
    ? parseInt(valores.monto, 10).toLocaleString('es-CL') 
    : ''

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#111217]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingBottom: 220, // Espacio para el GradientFooter
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-end w-full">
          
          {/* Amount Input */}
          <View className="flex-row items-center justify-end mb-[24px]">
            <Text className="text-[#60677D] text-[40px] font-light mr-[4px]">$</Text>
            <TextInput
              ref={montoRef}
              value={formattedAmount}
              onChangeText={handleAmountChange}
              placeholder="0"
              placeholderTextColor="#60677D"
              keyboardType="numeric"
              selectionColor="#ffffff"
              autoFocus={true}
              className={`text-[40px] font-light p-0 m-0 min-w-[30px] text-right ${valores.monto ? 'text-white' : 'text-[#60677D]'}`}
            />
          </View>

          {/* Description Input */}
          <TextInput
            value={valores.item}
            onChangeText={(val) => handleChange('item', val)}
            placeholder="Descripción..."
            placeholderTextColor="#60677D"
            maxLength={40}
            selectionColor="#ffffff"
            className={`text-[16px] text-right p-0 m-0 mb-[32px] w-full ${valores.item ? 'text-white' : 'text-[#60677D]'}`}
          />

          {/* Date Picker Pill */}
          <Pressable 
            className="flex-row items-center bg-[#262A35] rounded-full px-[16px] py-[8px] mb-[32px] active:opacity-80"
            onPress={() => handleChange('fecha', !valores.fecha || valores.fecha.toLowerCase() === 'hoy' ? 'Ayer' : 'Hoy')}
          >
            <Feather name="calendar" size={16} color="#60677D" />
            <Text className={`text-[14px] mx-[8px] ${valores.fecha ? 'text-white' : 'text-[#60677D]'}`}>
              {valores.fecha || 'Hoy'}
            </Text>
            <Feather name="chevron-down" size={16} color="#60677D" />
          </Pressable>

          {/* Categories */}
          <CategorySelector 
            selectedCategory={valores.categoria}
            onSelectCategory={(cat) => handleChange('categoria', cat)}
          />

          {/* Payment Methods */}
          <PaymentMethodSelector 
            method={metodo}
            onSelectMethod={setMetodo}
          />
        </View>

        {/* Submit Section */}
        <View className="mt-[64px] items-end w-full">
          {estado === 'ok' && (
            <Text className="text-[#4a7c59] text-[12px] tracking-[2px] text-right mb-[16px] w-full">
              {mensaje}
            </Text>
          )}
          {estado === 'error' && (
            <Text className="text-[#a65b5b] text-[12px] tracking-[2px] text-right mb-[16px] w-full">
              {mensaje}
            </Text>
          )}

          <Pressable
            onPress={handleGuardar}
            disabled={!listo || estado === 'loading'}
            className={`w-[56px] h-[56px] rounded-full items-center justify-center shadow-lg ${!listo || estado === 'loading' ? 'bg-[#262A35]' : 'bg-white active:opacity-80'}`}
          >
            {estado === 'loading' ? (
              <ActivityIndicator color="#111217" size="small" />
            ) : (
              <Feather name="check" size={24} color={!listo ? '#60677D' : '#111217'} />
            )}
          </Pressable>
        </View>
        
      </ScrollView>
    </KeyboardAvoidingView>
  )
}