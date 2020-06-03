import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { ITourGuideContext, TourGuideContext } from './TourGuideContext'
import { Steps, Step } from '../types'

interface State {
  steps?: Steps
  currentStep?: Step
  visible: boolean
}

export interface TourGuideProviderProps extends ITourGuideContext {
  children: React.ReactNode
}

export const TourGuideProvider = ({
  children,
  wrapperStyle,
  ...props
}: TourGuideProviderProps) => {
  const [state, setState] = React.useState<State>({
    steps: undefined,
    currentStep: undefined,
    visible: false,
  })

  return (
    <View style={[styles.container, wrapperStyle]}>
      <TourGuideContext.Provider value={props}>
        {children}
      </TourGuideContext.Provider>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
