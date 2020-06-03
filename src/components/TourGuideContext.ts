import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { TooltipProps } from './Tooltip'
import { Labels } from '../types'

export type Handler = (event?: any) => void
export interface Emitter {
  on(type: string, handler: Handler): void
  off(type: string, handler: Handler): void
  emit(type: string, event?: any): void
}

export interface ITourGuideContext {
  tooltipComponent?: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  labels?: Labels
  androidStatusBarVisible?: boolean
  backdropColor?: string
  stopOnOutsideClick?: boolean
  verticalOffset?: number
  wrapperStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  borderRadius?: number
  animationDuration?: number
  eventEmitter?: Emitter
  start?(): void
  stop?(): void
}

export const TourGuideContext = React.createContext<ITourGuideContext>({})
