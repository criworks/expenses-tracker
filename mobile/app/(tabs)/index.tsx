import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { useEffect } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORES_CAT, MESES, EMOJIS_CAT } from '../../constants/theme'
import { useGastos } from '../../hooks/useGastos'
import { ExpenseItem } from '../../components/ui/ExpenseItem'
import { useFilter } from '../../contexts/FilterContext'

export default function DashboardScreen() {
  const {
    mes,
    setMes,
    datos,
    loading,
    refreshing,
    fetchGastos,
    categorias,
    totalMes,
  } = useGastos()

  const insets = useSafeAreaInsets()
  const listPaddingBottom = 220 + insets.bottom;
  const { selectedCategory, setAvailableCategories } = useFilter()

  // Creamos un string con los nombres para que useEffect sepa cuándo cambiaron las categorías reales
  const catNames = categorias.map(c => c[0]).join(',');
  
  useEffect(() => {
    // Sincronizamos las categorías que realmente tienen gastos este mes hacia el Footer
    setAvailableCategories(categorias.map(c => c[0]));
  }, [catNames, setAvailableCategories]);

  // Filtramos la lista de datos en base a selectedCategory
  const gastosFiltrados = datos?.datos.filter(g => 
    selectedCategory ? g.categoria === selectedCategory : true
  ) || [];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#111217]">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: listPaddingBottom }} // paddingBottom alto para el GradientFooter
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchGastos(true)}
            tintColor="#262A35"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Ahora consistente con Categorias */}
        <View className="mb-[24px]">
          {loading && !datos ? (
            <>
              <View className="h-[24px] w-[120px] bg-[#262A35] rounded-full mb-[8px]" />
              <View className="h-[16px] w-[80px] bg-[#262A35] rounded-full" />
            </>
          ) : (
            <>
              <Text className="text-[#60677D] text-[24px] font-medium mb-[8px]">
                {MESES[mes - 1]}
              </Text>
              <Text className="text-white text-[16px] font-medium">
                ${totalMes.toLocaleString('es-CL')}
              </Text>
            </>
          )}
        </View>

        {loading && !datos ? (
          <View className="mb-[24px]">
            <View className="h-[16px] w-[80px] bg-[#262A35] rounded-full mb-[16px]" />
            <View className="gap-[16px]">
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-[12px]">
                    <View className="w-[40px] h-[40px] bg-[#262A35] rounded-full" />
                    <View className="gap-[4px]">
                      <View className="h-[14px] w-[100px] bg-[#262A35] rounded-full" />
                      <View className="h-[12px] w-[60px] bg-[#262A35] rounded-full" />
                    </View>
                  </View>
                  <View className="h-[14px] w-[70px] bg-[#262A35] rounded-full" />
                </View>
              ))}
            </View>
          </View>
        ) : !datos || datos.cantidad === 0 ? (
          <Text className="text-[#60677D] text-[14px] font-medium">No hay gastos este mes</Text>
        ) : (
          <View className="mb-[24px]">
            <Text className="text-[#60677D] text-[16px] font-medium mb-[16px]">
              Historial
            </Text>
            {gastosFiltrados.length === 0 ? (
              <Text className="text-[#60677D] text-[14px] font-medium">No hay gastos en esta categoría</Text>
            ) : (
              <View className="gap-[16px]">
                {gastosFiltrados.map(g => (
                  <ExpenseItem
                    key={g.id}
                    monto={g.monto_formateado}
                    metodoPago={g.metodo}
                    emoji={EMOJIS_CAT[g.categoria] || '📌'}
                    titulo={g.item}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
