import * as React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { TourGuideZone } from './TourGuideZone'
import { Shape } from '../types'

interface TourGuideZoneByPositionProps {
  zone: number
  isTourGuide?: boolean
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  width?: number | string
  height?: number | string
  shape?: Shape
  containerStyle?: StyleProp<ViewStyle>
  keepTooltipPosition?: boolean
}

export const TourGuideZoneByPosition = ({
  isTourGuide,
  zone,
  width,
  height,
  top,
  left,
  right,
  bottom,
  shape,
  containerStyle,
  keepTooltipPosition,
}: TourGuideZoneByPositionProps) => {
  if (!isTourGuide) {
    return null
  }

  return (
    <View
      pointerEvents='none'
      style={[StyleSheet.absoluteFillObject, containerStyle]}
    >
      <TourGuideZone
        isTourGuide
        {...{ zone, shape, keepTooltipPosition }}
        style={{
          height,
          width,
          top,
          right,
          bottom,
          left,
        }}
      />
    </View>
  )
}
