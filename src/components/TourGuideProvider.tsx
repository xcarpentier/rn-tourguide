import mitt from 'mitt'
import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { TourGuideContext } from '../components/TourGuideContext'
import { useIsMounted } from '../hooks/useIsMounted'
import { IStep, Labels, StepObject, Steps } from '../types'
import * as utils from '../utilities'
import { Modal } from './Modal'
import { OFFSET_WIDTH } from './style'
import { TooltipProps } from './Tooltip'

const { useMemo, useEffect, useState, useRef } = React

/*
This is the maximum wait time for the steps to be registered before starting the tutorial
At 60fps means 2 seconds
*/
const MAX_START_TRIES = 120

export interface TourGuideProviderProps {
  tooltipComponent?: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  labels?: Labels
  androidStatusBarVisible?: boolean
  startAtMount?: boolean
  backdropColor?: string
  verticalOffset?: number
  wrapperStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  borderRadius?: number
  animationDuration?: number
  children: React.ReactNode
  dismissOnPress: boolean
}

export const TourGuideProvider = ({
  children,
  wrapperStyle,
  labels,
  tooltipComponent,
  tooltipStyle,
  androidStatusBarVisible,
  backdropColor,
  animationDuration,
  maskOffset,
  borderRadius,
  verticalOffset,
  startAtMount = false,
  dismissOnPress = false,
}: TourGuideProviderProps) => {
  const [visible, setVisible] = useState<boolean | undefined>(undefined)
  const [currentStep, updateCurrentStep] = useState<IStep | undefined>()
  const [steps, setSteps] = useState<Steps>({})
  const [canStart, setCanStart] = useState<boolean>(false)

  const startTries = useRef<number>(0)
  const mounted = useIsMounted()

  const eventEmitter = useMemo(() => new mitt(), [])

  const modal = useRef<any>()

  useEffect(() => {
    if (mounted && visible === false) {
      eventEmitter.emit('stop')
    }
  }, [visible])

  useEffect(() => {
    if (visible || currentStep) {
      moveToCurrentStep()
    }
  }, [visible, currentStep])

  useEffect(() => {
    if (mounted) {
      if (Object.entries(steps).length > 0) {
        setCanStart(true)
        if (startAtMount) {
          start()
        }
      } else {
        setCanStart(false)
      }
    }
  }, [mounted, steps])

  const moveToCurrentStep = async () => {
    const size = await currentStep!.target.measure()
    if (isNaN(size.width) || isNaN(size.height) || isNaN(size.x) || isNaN(size.y)) {
      return;
    }
    await modal.current?.animateMove({
      width: size.width + OFFSET_WIDTH,
      height: size.height + OFFSET_WIDTH,
      left: Math.round(size.x) - OFFSET_WIDTH / 2,
      top: Math.round(size.y) - OFFSET_WIDTH / 2 + (verticalOffset || 0),
    })
  }

  const setCurrentStep = (step?: IStep) =>
    new Promise<void>((resolve) => {
      updateCurrentStep(() => {
        eventEmitter.emit('stepChange', step)
        resolve()
        return step
      })
    })

  const getNextStep = (step: IStep | undefined = currentStep) =>
    utils.getNextStep(steps!, step)

  const getPrevStep = (step: IStep | undefined = currentStep) =>
    utils.getPrevStep(steps!, step)

  const getFirstStep = () => utils.getFirstStep(steps!)

  const getLastStep = () => utils.getLastStep(steps!)

  const isFirstStep = useMemo(() => currentStep === getFirstStep(), [
    currentStep,
  ])

  const isLastStep = useMemo(() => currentStep === getLastStep(), [currentStep])

  const next = () => setCurrentStep(getNextStep()!)

  const prev = () => setCurrentStep(getPrevStep()!)

  const stop = () => {
    setVisible(false)
    setCurrentStep(undefined)
  }

  const registerStep = (step: IStep) => {
    setSteps((previousSteps) => {
      return {
        ...previousSteps,
        [step.name]: step,
      }
    })
  }

  const unregisterStep = (stepName: string) => {
    if (!mounted) {
      return
    }
    setSteps((previousSteps) => {
      return Object.entries(previousSteps as StepObject)
        .filter(([key]) => key !== stepName)
        .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
    })
  }

  const getCurrentStep = () => currentStep

  const start = async (fromStep?: number) => {
    const currentStep = fromStep
      ? (steps as StepObject)[fromStep]
      : getFirstStep()

    if (startTries.current > MAX_START_TRIES) {
      startTries.current = 0
      return
    }
    if (!currentStep) {
      startTries.current += 1
      requestAnimationFrame(() => start(fromStep))
    } else {
      eventEmitter.emit('start')
      await setCurrentStep(currentStep!)
      setVisible(true)
      startTries.current = 0
    }
  }

  return (
    <View style={[styles.container, wrapperStyle]}>
      <TourGuideContext.Provider
        value={{
          eventEmitter,
          registerStep,
          unregisterStep,
          getCurrentStep,
          start,
          stop,
          canStart,
        }}
      >
        {children}
        <Modal
          ref={modal}
          {...{
            next,
            prev,
            stop,
            visible,
            isFirstStep,
            isLastStep,
            currentStep,
            labels,
            tooltipComponent,
            tooltipStyle,
            androidStatusBarVisible,
            backdropColor,
            animationDuration,
            maskOffset,
            borderRadius,
            dismissOnPress,
          }}
        />
      </TourGuideContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
