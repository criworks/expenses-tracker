import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Pressable } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { supabase } from '../../services/supabase'
import { Input } from '../../components/ui/Input'
import { Alert } from '../../components/ui/Alert'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [alertConfig, setAlertConfig] = useState<{ visible: boolean; message: string; type: 'warning' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' })
  
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const showAlert = (message: string, type: 'warning' | 'error' | 'info') => {
    setAlertConfig({ visible: true, message, type })
    setTimeout(() => {
      setAlertConfig(prev => ({ ...prev, visible: false }))
    }, 3000)
  }

  const handleSendOtp = async () => {
    if (!email.trim()) return
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    })

    setLoading(false)

    if (error) {
      if (error.message.includes('rate limit')) {
        showAlert('Demasiados intentos. Esperá unos minutos y volvé a intentar.', 'error')
      } else {
        showAlert(error.message, 'error')
      }
      return
    }

    router.push({
      pathname: '/(auth)/verify',
      params: { email: email.trim() }
    })
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background">
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 220 + insets.bottom,
            alignItems: 'center'
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[350px] flex-col items-start gap-xl">
            <View className="w-full flex-col items-start gap-sm">
              <Text className="text-foreground font-['Inter'] text-title font-semibold leading-[normal]">
                Ingresar
              </Text>
            </View>
            
            <View className="w-full flex-col items-center gap-xl">
              
              <View className="w-full flex-col items-start gap-sm">
                <Text 
                  className="text-muted-foreground font-['Inter'] text-body font-normal leading-[normal]"
                  numberOfLines={1}
                >
                  Tu email
                </Text>
                
                <View className="w-full relative justify-center">
                  <Input 
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="tu@email.com"
                    editable={!loading}
                    className={`w-full ${isEmailFocused ? 'border-2 border-muted-foreground' : 'border border-transparent'}`}
                  />
                </View>
              </View>

              {email.trim().length > 0 && (
                <View className="w-full flex-col items-center gap-lg">
                  <Pressable
                    onPress={handleSendOtp}
                    disabled={loading}
                    className={`w-full h-[56px] px-xl justify-center items-center rounded-[16px] bg-primary active:opacity-80 ${loading ? 'opacity-50' : ''}`}
                  >
                    <Text className="text-primary-foreground font-['Inter'] text-body font-semibold leading-[normal]">
                      {loading ? 'Enviando...' : 'Enviar código de 6 dígitos'}
                    </Text>
                  </Pressable>
                </View>
              )}
              
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Alert 
        visible={alertConfig.visible} 
        message={alertConfig.message} 
        type={alertConfig.type}
      />
    </SafeAreaView>
  )
}
