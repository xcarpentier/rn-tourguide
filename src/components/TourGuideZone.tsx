import * as React from 'react'
import CopilotStep from './CopilotStep'
import { Shape } from '../types'

interface TourGuideZoneProps {
  zone: number
  isTourGuide?: boolean
  text?: string
  shape?: Shape
  maskOffset?: number
  borderRadius?: number
  children: React.ReactNode
}

export const TourGuideZone = ({
  isTourGuide,
  zone,
  children,
  shape,
  text,
  maskOffset,
  borderRadius,
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
      {children}
    </CopilotStep>
  )
}
