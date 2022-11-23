import * as React from 'react'
import { IStep } from '../types'

export type Handler = (event?: any) => void
export interface Emitter {
  on(type: string, handler: Handler): void
  off(type: string, handler: Handler): void
  emit(type: string, event?: any): void
}
export type Ctx<T extends any> = Record<string, T> & { _default: T }

export interface ITourGuideContext {
  setTourKey?: (tourKey: string) => void
  eventEmitter?: Ctx<Emitter>
  canStart: Ctx<boolean>
  registerStep?(key: string, step: IStep): void
  unregisterStep?(key: string, stepName: string): void
  getCurrentStep?(key: string): IStep | undefined
  start?(key: string, fromStep?: number): void
  stop?(key: string): void
}

export const TourGuideContext = React.createContext<ITourGuideContext>({
  canStart: { _default: false },
})
