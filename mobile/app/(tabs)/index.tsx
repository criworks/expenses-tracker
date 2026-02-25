import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { COLORES_CAT, MESES } from '../../constants/theme'
import { useGastos } from '../../hooks/useGastos'

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

  return (
    <ScrollView
      className="flex-1 bg-[#111217]"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchGastos(true)}
          tintColor="#262A35"
        />
      }
    >
      {/* Header */}
      <Text className="text-[#60677D] text-[12px] tracking-[6px] uppercase mb-[24px]">
        expenses
      </Text>

      {/* Selector de mes */}
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

      {loading ? (
        <ActivityIndicator color="#262A35" className="mt-[24px]" />
      ) : !datos || datos.cantidad === 0 ? (
        <Text className="text-[#60677D] text-[12px] tracking-[3px] uppercase mt-[24px]">
          sin gastos este mes
        </Text>
      ) : (
        <>
          {/* Total */}
          <View className="mb-[24px]">
            <Text className="text-[#60677D] text-[12px] tracking-[4px] uppercase mb-[8px]">
              total {MESES[mes - 1]}
            </Text>
            <Text className="text-white text-[40px] font-light tracking-[-1px]">
              {datos.totalFormateado}
            </Text>
            <Text className="text-[#60677D] text-[12px] mt-[8px]">
              {datos.cantidad} gastos
            </Text>
          </View>

          {/* Por categoría */}
          <View className="mb-[24px]">
            <Text className="text-[#60677D] text-[12px] tracking-[4px] uppercase mb-[16px]">
              por categoría
            </Text>
            {categorias.map(([cat, info]) => {
              const pct = totalMes > 0 ? (info.total / totalMes) * 100 : 0
              const color = COLORES_CAT[cat] ?? '#444'
              return (
                <View key={cat} className="mb-[16px]">
                  <View className="flex-row justify-between mb-[8px]">
                    <Text className="text-[#60677D] text-[12px] tracking-[3px] uppercase">
                      {cat}
                    </Text>
                    <Text className="text-white text-[14px] font-light">
                      ${info.total.toLocaleString('es-CL')}
                    </Text>
                  </View>
                  <View className="h-[1px] bg-[#262A35] w-full">
                    <View
                      className="h-[1px]"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </View>
                </View>
              )
            })}
          </View>

          {/* Lista */}
          <View className="mb-[24px]">
            <Text className="text-[#60677D] text-[12px] tracking-[4px] uppercase mb-[16px]">
              gastos
            </Text>
            {datos.datos.map(g => (
              <View
                key={g.id}
                className="flex-row justify-between items-center py-[16px] border-b border-[#262A35]"
              >
                <View className="flex-row items-center gap-[12px] flex-1">
                  <View
                    className="w-[5px] h-[5px] rounded-[3px]"
                    style={{ backgroundColor: COLORES_CAT[g.categoria] ?? '#444' }}
                  />
                  <View>
                    <Text className="text-white text-[14px] font-light">{g.item}</Text>
                    <Text className="text-[#60677D] text-[12px] mt-[8px]">
                      {g.categoria} · {g.fecha}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-white text-[14px] font-light">{g.monto_formateado}</Text>
                  <Text className="text-[#60677D] text-[12px] mt-[8px]">{g.metodo}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  )
}
