import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { Shape } from '../types'
import { Step } from './Step'
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
  tooltipBottomOffset?: number
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
  tooltipBottomOffset,
}: TourGuideZoneProps) => {
  if (!isTourGuide) {
    return <>{children}</>
  }

  return (
    <Step
      text={text ?? `Zone ${zone}`}
      order={zone}
      name={`${zone}`}
      {...{
        shape,
        maskOffset,
        borderRadius,
        keepTooltipPosition,
        tooltipBottomOffset,
      }}
    >
      <Wrapper {...{ style }}>{children}</Wrapper>
    </Step>
  )
}
