import React from 'react';
import { Text, TouchableOpacity, View, TextInput, ViewProps } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  const base = 'items-center justify-center rounded-xl px-4 py-3';
  const map: Record<string, string> = {
    primary: 'bg-[#0E5D6C]',
    outline: 'border border-[#1F2B33]',
    ghost: ''
  };
  return (
    <TouchableOpacity onPress={onPress} className={`${base} ${map[variant]}`}>
      <Text className="text-white">{title}</Text>
    </TouchableOpacity>
  );
}

export interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (v: string) => void;
}

export function Input({ placeholder, value, onChangeText }: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#6b7f87"
      value={value}
      onChangeText={onChangeText}
      className="rounded-xl border border-[#1F2B33] bg-[#101A1F] px-4 py-3 text-white"
    />
  );
}

export function Card({ children, ...props }: ViewProps & { children?: React.ReactNode }) {
  return (
    <View {...props} className={`rounded-2xl border border-[#1F2B33] bg-[#101A1F] ${props.className ?? ''}`}>
      {children}
    </View>
  );
}


