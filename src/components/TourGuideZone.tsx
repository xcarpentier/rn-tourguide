import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { BorderRadiusObject, CustomPosition, Shape } from '../types'
import { Step } from './Step'
import { Wrapper } from './Wrapper'

export interface TourGuideZoneProps {
  zone: number
  tourKey?: string
  isTourGuide?: boolean
  text?: string
  shape?: Shape
  maskOffset?: number
  borderRadius?: number
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  borderRadiusObject?: BorderRadiusObject
  customPosition?: Partial<CustomPosition>
  enableArrow?: boolean
  arrowHorizontalOffset?: number
}

export const TourGuideZone = ({
  isTourGuide = true,
  tourKey = '_default',
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
  customPosition,
  enableArrow,
  arrowHorizontalOffset,
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
        tourKey,
        shape,
        maskOffset,
        borderRadius,
        keepTooltipPosition,
        tooltipBottomOffset,
        borderRadiusObject,
        customPosition,
        enableArrow,
        arrowHorizontalOffset,
      }}
    >
      <Wrapper {...{ style }}>{children}</Wrapper>
    </Step>
  )
}
