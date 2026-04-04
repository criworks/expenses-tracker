import React, { useState, useRef, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Pressable, TextInput } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../services/supabase'
import { Input } from '../../components/ui/Input'
import { Alert } from '../../components/ui/Alert'
import { Notification } from '../../components/ui/Notification'
import { Clock } from 'phosphor-react-native'

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Custom states like in cuenta.tsx
  const [isOtpFocused, setIsOtpFocused] = useState(false)
  const [otpError, setOtpError] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [alertConfig, setAlertConfig] = useState<{ visible: boolean; message: string; type: 'warning' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' })
  const [showSuccess, setShowSuccess] = useState(false)

  const router = useRouter()
  const insets = useSafeAreaInsets()
  const otpInputRef = useRef<TextInput>(null)

  const showAlert = (message: string, type: 'warning' | 'error' | 'info') => {
    setAlertConfig({ visible: true, message, type })
    setTimeout(() => {
      setAlertConfig(prev => ({ ...prev, visible: false }))
    }, 3000)
  }

  // Blinking cursor effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOtpFocused) {
      setCursorVisible(true)
      interval = setInterval(() => {
        setCursorVisible((v) => !v)
      }, 500)
    } else {
      setCursorVisible(false)
    }
    return () => clearInterval(interval)
  }, [isOtpFocused])

  // Cooldown effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (cooldownSeconds > 0) {
      interval = setInterval(() => {
        setCooldownSeconds((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [cooldownSeconds])

  const handleVerifyOtp = async () => {
    if (token.length !== 6 || !email) return

    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    setLoading(false)

    if (error) {
      setOtpError(true)
    } else {
      setShowSuccess(true)
      // AuthContext will detect session and redirect to (tabs)
    }
  }

  // Auto-submit OTP
  useEffect(() => {
    if (token.length === 6 && !loading && !otpError) {
      handleVerifyOtp()
    }
  }, [token, loading, otpError])

  const handleOtpChange = (val: string) => {
    setToken(val.replace(/[^0-9]/g, '').slice(0, 6))
    if (otpError) setOtpError(false)
  }

  const handleResend = async () => {
    if (!email) return
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })
    
    setLoading(false)
    if (error) {
      const match = error.message.match(/after (\d+) second/i)
      if (match) {
        setCooldownSeconds(parseInt(match[1], 10))
      } else {
        showAlert(error.message, 'error')
      }
    } else {
      showAlert('Código reenviado', 'info')
    }
  }

  const renderOtpDots = () => {
    const dots = []
    for (let i = 0; i < 6; i++) {
      const char = token[i]
      const isCurrent = i === token.length
      
      let displayChar = '•'
      let colorClass = 'text-muted-foreground'
      
      if (char) {
        displayChar = char
        colorClass = 'text-foreground'
      } else if (isCurrent && isOtpFocused) {
        displayChar = '|'
        colorClass = cursorVisible ? 'text-foreground' : 'text-transparent'
      }

      dots.push(
        <Text key={i} className={`text-subtitle font-normal font-['Inter'] leading-[normal] ${colorClass}`}>
          {displayChar}
        </Text>
      )
    }
    return dots
  }

  const otpBorderClass = otpError 
    ? 'border-destructive' 
    : isOtpFocused 
      ? 'border-muted-foreground' 
      : 'border-transparent'

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
                Verificar email
              </Text>
            </View>
            
            <View className="w-full flex-col items-center gap-xl">
              
              {/* EMAIL INPUT SHOWCASE */}
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
                    editable={false}
                    className="w-full pr-4xl border border-transparent text-muted-foreground"
                  />
                  <View className="absolute right-lg pointer-events-none">
                    <Clock size={18} color="#E98B00" weight="fill" />
                  </View>
                </View>
              </View>

              <View className="w-full p-xl flex-col justify-center items-start gap-lg rounded-[16px] border border-warning-border">
                <View className="justify-center items-start gap-lg rounded-[16px]">
                  <Clock size={18} color="#E98B00" weight="fill" />
                </View>
                <Text className="text-warning font-['Inter'] text-detail font-normal leading-[normal]">
                  Ingresa el código de 6 dígitos para iniciar sesión.
                </Text>
              </View>

              <View className="w-full flex-col items-start gap-sm">
                <Text 
                  className="text-muted-foreground font-['Inter'] text-body font-normal leading-[normal]"
                  numberOfLines={1}
                >
                  Ingresa el código de verificación
                </Text>
                
                <Pressable 
                  className={`w-full h-[56px] px-xl flex-row justify-center items-center gap-lg rounded-[16px] bg-secondary border-2 ${otpBorderClass}`}
                  onPress={() => otpInputRef.current?.focus()}
                >
                  {renderOtpDots()}
                </Pressable>

                <TextInput
                  ref={otpInputRef}
                  value={token}
                  onChangeText={handleOtpChange}
                  keyboardType="numeric"
                  maxLength={6}
                  className="absolute w-[1px] h-[1px] opacity-0"
                  autoFocus={true}
                  onFocus={() => setIsOtpFocused(true)}
                  onBlur={() => setIsOtpFocused(false)}
                />
                
                {otpError && (
                  <Text className="text-destructive font-['Inter'] text-detail font-normal leading-[normal] mt-sm">
                    Código incorrecto o ha expirado. Intenta nuevamente.
                  </Text>
                )}
              </View>

              <View className="w-full flex-col items-center gap-sm mt-lg">
                <Pressable
                  onPress={handleResend}
                  disabled={loading || cooldownSeconds > 0}
                  className="w-full py-md px-xl justify-center items-center rounded-[16px] active:opacity-80"
                >
                  <Text className="text-muted-foreground font-['Inter'] text-body font-medium leading-[normal]">
                    {cooldownSeconds > 0 ? `Reenviar en ${cooldownSeconds}s` : 'Reenviar código'}
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={() => router.back()}
                  disabled={loading}
                  className="w-full py-md px-xl justify-center items-center rounded-[16px] active:opacity-80"
                >
                  <Text className="text-muted-foreground font-['Inter'] text-body font-medium leading-[normal]">
                    Usar otro email
                  </Text>
                </Pressable>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Notification 
        visible={showSuccess} 
        message="Verificación exitosa." 
        type="success"
      />
      <Alert 
        visible={cooldownSeconds > 0} 
        message={`Por seguridad debes esperar ${cooldownSeconds} segundos para pedir otro código.`}
        type="warning"
      />
      <Alert 
        visible={alertConfig.visible} 
        message={alertConfig.message} 
        type={alertConfig.type}
      />
    </SafeAreaView>
  )
}
