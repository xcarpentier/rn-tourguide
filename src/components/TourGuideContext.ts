import * as React from 'react'
import { Step } from '../types'

export type Handler = (event?: any) => void
export interface Emitter {
  on(type: string, handler: Handler): void
  off(type: string, handler: Handler): void
  emit(type: string, event?: any): void
}

export interface ITourGuideContext {
  eventEmitter?: Emitter
  registerStep?(step: Step): void
  unregisterStep?(stepName: string): void
  getCurrentStep?(): Step | undefined
  start?(fromStep?: number): void
  stop?(): void
}
export const TourGuideContext = React.createContext<ITourGuideContext>({})
