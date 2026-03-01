import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MenuItemProps {
  title: string;
  value?: string;
  onPress?: () => void;
}

export function MenuItem({ title, value, onPress }: MenuItemProps) {
  return (
    <Pressable 
      onPress={onPress}
      className="flex-row items-center justify-between px-[24px] py-[16px] active:opacity-80"
    >
      <Text className="text-[#60677D] text-[16px]">{title}</Text>
      <View className="flex-row items-center gap-[8px]">
        {value ? <Text className="text-[#ffffff] text-[16px] font-medium">{value}</Text> : null}
        <Feather name="chevron-right" size={16} color="#60677D" />
      </View>
    </Pressable>
  );
}
