import * as React from 'react'

import { ConnectedCopilotStep } from './ConnectedCopilotStep'
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

export const CopilotStep = (props: Props) => {
  const _copilot = React.useContext(TourGuideContext)
  return <ConnectedCopilotStep {...{ ...props, _copilot }} />
}
