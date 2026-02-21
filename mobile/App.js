import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { Text } from 'react-native'
import CapturaScreen from './screens/CapturaScreen'
import DashboardScreen from './screens/DashboardScreen'

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0e0e0e',
            borderTopColor: '#1a1a1a',
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#e8e8e8',
          tabBarInactiveTintColor: '#333',
          tabBarLabelStyle: {
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
          },
        }}
      >
        <Tab.Screen
          name="Captura"
          component={CapturaScreen}
          options={{
            tabBarLabel: 'nuevo',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 16 }}>+</Text>,
          }}
        />
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'gastos',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 14 }}>≡</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
