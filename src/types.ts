import * as React from 'react'

export type Shape =
  | 'circle'
  | 'rectangle'
  | 'circle_and_keep'
  | 'rectangle_and_keep'

export interface Step {
  name: string
  order: number
  visible?: boolean
  target: any
  text: string
  wrapper: any
  shape?: Shape
  maskOffset?: number
  borderRadius?: number
}
export interface StepObject {
  [key: string]: Step
}
export type Steps = StepObject | Step[]

export interface ValueXY {
  x: number
  y: number
}

export type SvgPath = string

// with flubber
export interface AnimJSValue {
  _value: number
}
export interface SVGMaskPathMorphParam {
  animation: AnimJSValue
  previousPath: SvgPath
  to: {
    position: ValueXY
    size: ValueXY
    shape?: Shape
    maskOffset?: number
    borderRadius?: number
  }
}
export type SVGMaskPathMorph = (
  param: SVGMaskPathMorphParam,
) => string | string[]

/**
 * Props received by walkthroughable components
 *
 * The components wrapped inside CopilotStep, will receive a copilot prop of type Object which the outermost rendered element
 * of the component or the element that you want the tooltip be shown around, must extend.
 *
 * Example walkthroughable custom component:
 *
 * const CustomComponent = ({ copilot }) => <View {...copilot}><Text>Hello world!</Text></View>;
 */
export interface WalkthroughableProps {
  copilot?: object
}

/**
 * Props received by the screen component that you want to use copilot with.
 * This is the component that starts the copilot and manages the step flow
 */
export type CopilotWrappedComponentProps = {
  copilotEvents: any // a function to help you with tracking of tutorial progress
  currentStep: Step
  visible: boolean
  start: () => void // Use this function in the root component in order to trigger the tutorial
} & React.ComponentProps<any>

/**
 * Props of the copilot step element
 */
export interface CopilotStepProps {
  name: string // A unique name for the walkthrough step
  order: number // A positive number indicating the order of the step in the entire walkthrough
  text: string // The text shown as the description for the step
  active?: boolean // If set to false the step is ignored
}

export interface Labels {
  skip?: string
  previous?: string
  next?: string
  finish?: string
}
