import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { Step } from './Step'
import { Shape } from '../types'
import { Wrapper } from './Wrapper'

export interface TourGuideZoneProps {
  zone: number
  isTourGuide?: boolean
  text?: string
  shape?: Shape
  maskOffset?: number
  borderRadius?: number
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  keepTooltipPosition?: boolean
}

export const TourGuideZone = ({
  isTourGuide = true,
  zone,
  children,
  shape,
  text,
  maskOffset,
  borderRadius,
  style,
  keepTooltipPosition,
}: TourGuideZoneProps) => {
  if (!isTourGuide) {
    return <>{children}</>
  }

  return (
    <Step
      text={text ?? `Zone ${zone}`}
      order={zone}
      name={`${zone}`}
      {...{ shape, maskOffset, borderRadius, keepTooltipPosition }}
    >
      <Wrapper {...{ style }}>{children}</Wrapper>
    </Step>
  )
}
