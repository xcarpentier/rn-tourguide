import * as React from 'react'
import { IStep } from '../types'

export type Handler = (event?: any) => void
export interface Emitter {
  on(type: string, handler: Handler): void
  off(type: string, handler: Handler): void
  emit(type: string, event?: any): void
}

export interface ITourGuideContext {
  eventEmitter?: Emitter
  canStart: boolean
  registerStep?(step: IStep): void
  unregisterStep?(stepName: string): void
  getCurrentStep?(): IStep | undefined
  start?(fromStep?: number): void
  stop?(): void
}
export const TourGuideContext = React.createContext<ITourGuideContext>({
  canStart: false,
})
