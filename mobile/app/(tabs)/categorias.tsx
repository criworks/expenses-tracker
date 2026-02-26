import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORES_CAT, MESES } from '../../constants/theme'
import { useGastos } from '../../hooks/useGastos'

export default function CategoriasScreen() {
  const { mes, loading, refreshing, fetchGastos, categorias, totalMes } = useGastos()
  const insets = useSafeAreaInsets()
  // El GradientFooter tiene altura 200px aquí (sin emojis), usamos 140 + insets.bottom para no tener exceso de scroll vacío
  const listPaddingBottom = 140 + insets.bottom

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#111217]">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: listPaddingBottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchGastos(true)}
            tintColor="#262A35"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color="#262A35" className="mt-[24px]" />
        ) : (
          <>
            {/* Header */}
            <View className="mt-[24px] mb-[24px]">
              <Text className="text-[#60677D] text-[24px] font-medium mb-[8px]">
                {MESES[mes - 1]}
              </Text>
              <Text className="text-white text-[16px] font-medium">
                Por categoría
              </Text>
            </View>

            {/* Lista por categoría */}
            <View className="mb-[24px]">
              {categorias.length === 0 ? (
                <Text className="text-[#60677D] text-[14px] font-medium">No hay datos para este mes</Text>
              ) : (
                categorias.map(([cat, info]) => {
                  const pct = totalMes > 0 ? (info.total / totalMes) * 100 : 0
                  // Sustituimos #444 por el token oficial #262A35
                  const color = COLORES_CAT[cat] ?? '#262A35'
                  
                  return (
                    <View key={cat} className="mb-[24px]">
                      <View className="flex-row justify-between mb-[8px]">
                        <Text className="text-[#ffffff] text-[14px] font-medium">
                          {cat}
                        </Text>
                        <Text className="text-white text-[14px] font-medium">
                          ${info.total.toLocaleString('es-CL')}
                        </Text>
                      </View>
                      
                      {/* Barra de progreso */}
                      <View className="h-[8px] bg-[#262A35] w-full rounded-full overflow-hidden">
                        <View
                          className="h-[8px] rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </View>
                      
                      <Text className="text-[#60677D] text-[12px] font-medium mt-[8px]">
                        {info.cantidad} {info.cantidad === 1 ? 'gasto' : 'gastos'} · {pct.toFixed(1)}%
                      </Text>
                    </View>
                  )
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
