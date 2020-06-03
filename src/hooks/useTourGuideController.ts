import * as React from 'react'
import { TourGuideContext } from '../components/TourGuideContext'

export const useTourGuideController = () => {
  const { start, stop, eventEmitter } = React.useContext(TourGuideContext)
  return {
    start,
    stop,
    eventEmitter,
  }
}
