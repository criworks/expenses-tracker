import React from 'react';
import { View, Text } from 'react-native';
import { Check } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SuccessNotificationProps {
  visible: boolean;
  monto: string;
  descripcion: string;
}

export function SuccessNotification({ visible, monto, descripcion }: SuccessNotificationProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View 
      className="absolute top-0 left-0 right-0 z-50 px-[24px]"
      style={{ paddingTop: insets.top > 0 ? insets.top + 16 : 40 }}
    >
      <View className="flex-row items-center justify-start max-w-full">
        <View className="flex-row items-center gap-[8px] bg-secondary/40 border-2 border-border-active px-[16px] py-[8px] rounded-full">
          <Check size={16} color="#ffffff" weight="bold" />
          <Text 
            className="text-foreground text-[14px] font-medium leading-[normal]" 
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            Agregado {monto} {descripcion}
          </Text>
        </View>
      </View>
    </View>
  );
}
