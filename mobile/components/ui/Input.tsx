import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';

export const Input = forwardRef<TextInput, TextInputProps>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      {...props}
      className={`h-[56px] px-[24px] rounded-[16px] bg-secondary text-[14px] font-normal font-['Inter'] ${props.value ? 'text-foreground' : 'text-muted-foreground'} ${props.className || ''}`}
      cursorColor="#ffffff"
      placeholderTextColor="hsl(var(--muted-foreground))"
    />
  );
});

Input.displayName = 'Input';
