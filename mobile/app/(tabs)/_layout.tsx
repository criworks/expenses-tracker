import { Feather } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111217',
          borderTopColor: '#262A35',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#60677D',
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 3,
          textTransform: 'uppercase',
          fontFamily: 'Inter_400Regular',
        },
      }}
    >
      <Tabs.Screen
        name="captura"
        options={{
          tabBarLabel: 'nuevo',
          tabBarIcon: ({ color }: { color: string }) => (
            <Feather name="plus-circle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'gastos',
          tabBarIcon: ({ color }: { color: string }) => (
            <Feather name="list" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
