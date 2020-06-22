import * as React from 'react'
import { TourGuideContext } from '../components/TourGuideContext'

export const useTourGuideController = () => {
  const {
    start,
    canStart,
    stop,
    eventEmitter,
    getCurrentStep,
  } = React.useContext(TourGuideContext)
  return {
    start,
    stop,
    eventEmitter,
    getCurrentStep,
    canStart,
  }
}
