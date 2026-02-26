import React from 'react';
import { View, Text } from 'react-native';

export interface ExpenseItemProps {
  id?: string;
  monto: string;
  metodoPago: string;
  emoji: string;
  titulo: string;
}

export function ExpenseItem({ monto, metodoPago, emoji, titulo }: ExpenseItemProps) {
  return (
    <View className="flex-row items-center gap-[12px]">
      <View className="bg-[#262A35] rounded-full px-[16px] py-[8px]">
        <Text className="text-[#ffffff] text-[14px] font-medium">{monto}</Text>
      </View>
      
      <View className="bg-[#262A35] rounded-full w-[32px] h-[32px] items-center justify-center">
        <Text className="text-[#60677D] text-[12px] font-medium">{metodoPago}</Text>
      </View>
      
      <View className="bg-[#262A35] rounded-full w-[32px] h-[32px] items-center justify-center">
        <Text className="text-[14px]">{emoji}</Text>
      </View>
      
      <Text className="text-[#60677D] text-[14px] font-medium">{titulo}</Text>
    </View>
  );
}
