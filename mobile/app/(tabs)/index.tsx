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
        {/* Header Viejo (Oculto)
        <Text className="text-[#60677D] text-[12px] tracking-[6px] uppercase mb-[24px]">
          expenses
        </Text>
        */}

        {/* Selector de mes (Oculto temporalmente)
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-[24px] -mx-[24px] px-[24px]"
        >
          {MESES.map((nombre, i) => {
            const num = i + 1
            const activo = mes === num
            return (
              <Pressable
                key={num}
                onPress={() => setMes(num)}
                className="mr-[16px] items-center"
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <Text
                  className={`text-[12px] tracking-[3px] uppercase ${
                    activo ? 'text-white' : 'text-[#60677D]'
                  }`}
                >
                  {nombre}
                </Text>
                {activo && <View className="w-[4px] h-[1px] bg-[#60677D] mt-[8px]" />}
              </Pressable>
            )
          })}
        </ScrollView>
        */}

        {loading ? (
          <ActivityIndicator color="#262A35" className="mt-[24px]" />
        ) : !datos || datos.cantidad === 0 ? (
          <Text className="text-[#60677D] text-[12px] tracking-[3px] uppercase mt-[24px]">
            sin gastos este mes
          </Text>
        ) : (
          <>
            {/* Total (Nuevo estilo del header generado por visión) */}
            {/* Añadimos mt-[24px] para darle un respiro más grande al haber ocultado los headers superiores */}
            <View className="mt-[24px] mb-[24px]">
              <Text className="text-[#60677D] text-[24px] font-medium mb-[8px]">
                {MESES[mes - 1]}
              </Text>
              <Text className="text-white text-[16px] font-medium">
                {datos.totalFormateado}
              </Text>
            </View>

            {/* Lista Refactorizada con ExpenseItem */}
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

          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
