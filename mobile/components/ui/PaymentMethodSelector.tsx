import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface PaymentMethodSelectorProps {
  method: string;
  onSelectMethod: (method: string) => void;
}

export function PaymentMethodSelector({ method, onSelectMethod }: PaymentMethodSelectorProps) {
  return (
    <View className="flex-row items-center justify-end">
      <Pressable 
        className="bg-[#262A35] rounded-full items-center justify-center w-[32px] h-[32px] mr-[16px] active:opacity-80"
        onPress={() => {}}
      >
        <Feather name="plus" size={16} color="#60677D" />
      </Pressable>
      
      <Pressable 
        className="mr-[16px] active:opacity-80"
        onPress={() => onSelectMethod('EF')}
      >
        <Text className={`text-[14px] ${method === 'EF' ? 'text-white font-bold' : 'text-[#60677D]'}`}>EF</Text>
      </Pressable>
      
      <Pressable 
        className="active:opacity-80"
        onPress={() => onSelectMethod('TC')}
      >
        <Text className={`text-[14px] ${method === 'TC' ? 'text-white font-bold' : 'text-[#60677D]'}`}>TC</Text>
      </Pressable>
    </View>
  );
}