import * as React from 'react'
import { StyleSheet, StyleProp, ViewStyle, View } from 'react-native'
import mitt from 'mitt'

import { Steps, IStep, Labels, StepObject } from '../types'
import { TourGuideContext } from '../components/TourGuideContext'
import { useIsMounted } from '../hooks/useIsMounted'
import { Modal } from './Modal'
import { TooltipProps } from './Tooltip'
import { OFFSET_WIDTH } from './style'
import * as utils from '../utilities'

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
  backdropColor?: string
  verticalOffset?: number
  wrapperStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  borderRadius?: number
  animationDuration?: number
  children: React.ReactNode
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
}: TourGuideProviderProps) => {
  const [visible, setVisible] = useState<boolean | undefined>(undefined)
  const [currentStep, updateCurrentStep] = useState<IStep | undefined>()
  const [steps, setSteps] = useState<Steps>({})
  const [startTries, setStartTries] = useState<number>(0)
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

  const moveToCurrentStep = async () => {
    const size = await currentStep!.target.measure()

    await modal.current?.animateMove({
      width: size.width + OFFSET_WIDTH,
      height: size.height + OFFSET_WIDTH,
      left: size.x - OFFSET_WIDTH / 2,
      top: size.y - OFFSET_WIDTH / 2 + (verticalOffset || 0),
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
    setSteps((previousSteps) => ({
      ...previousSteps,
      [step.name]: step,
    }))
  }

  const unregisterStep = (stepName: string) => {
    if (!mounted) {
      return
    }
    setSteps(
      Object.entries(steps as StepObject)
        .filter(([key]) => key !== stepName)
        .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {}),
    )
  }

  const getCurrentStep = () => currentStep

  const start = async (fromStep?: number) => {
    const currentStep = fromStep
      ? (steps as StepObject)[fromStep]
      : getFirstStep()

    if (startTries > MAX_START_TRIES) {
      setStartTries(0)
      return
    }

    if (!currentStep) {
      setStartTries(startTries + 1)
      start(fromStep)
    } else {
      eventEmitter.emit('start')
      await setCurrentStep(currentStep!)
      setVisible(true)
      setStartTries(0)
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
