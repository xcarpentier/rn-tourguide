import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { CopilotStep } from './CopilotStep'
import { Shape } from '../types'
import { CopilotWrapper } from './CopilotWrapper'

export interface TourGuideZoneProps {
  zone: number
  isTourGuide?: boolean
  text?: string
  shape?: Shape
  maskOffset?: number
  borderRadius?: number
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
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
}: TourGuideZoneProps) => {
  if (!isTourGuide) {
    return <>{children}</>
  }

  return (
    <CopilotStep
      text={text ?? `Zone ${zone}`}
      order={zone}
      name={`${zone}`}
      shape={shape}
      maskOffset={maskOffset}
      borderRadius={borderRadius}
    >
      <CopilotWrapper {...{ style }}>{children}</CopilotWrapper>
    </CopilotStep>
  )
}
