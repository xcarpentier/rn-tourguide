import * as React from 'react'

import { ConnectedStep } from './ConnectedStep'
import { Shape } from '../types'
import { TourGuideContext } from './TourGuideContext'

interface Props {
  name: string
  order: number
  text: string
  shape?: Shape
  active?: boolean
  maskOffset?: number
  borderRadius?: number
  children: React.ReactNode
}

export const Step = (props: Props) => {
  const context = React.useContext(TourGuideContext)
  return <ConnectedStep {...{ ...props, context }} />
}
