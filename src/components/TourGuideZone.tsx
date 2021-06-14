import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { BorderRadiusObject, Offset, Shape } from '../types'
import { Step } from './Step'
import { Wrapper } from './Wrapper'

export interface TourGuideZoneProps {
  zone: number
  isTourGuide?: boolean
  text?: string
  shape?: Shape
  maskOffset?: number | Offset
  borderRadius?: number
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  borderRadiusObject?: BorderRadiusObject
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
  borderRadiusObject,
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
        borderRadiusObject,
      }}
    >
      <Wrapper {...{ style }}>{children}</Wrapper>
    </Step>
  )
}
