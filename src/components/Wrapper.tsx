import * as React from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'

interface WrapperProps {
  copilot?: any
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}
export const Wrapper = ({ copilot, children, style }: WrapperProps) => (
  <View style={style} {...copilot}>
    {children}
  </View>
)
