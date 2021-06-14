import * as React from 'react'
import { BorderRadiusObject, Offset, Shape } from '../types'
import { ITourGuideContext } from './TourGuideContext'

declare var __TEST__: boolean

interface Props {
  name: string
  text: string
  order: number
  active?: boolean
  shape?: Shape
  context: ITourGuideContext
  children?: any
  maskOffset?: number | Offset
  borderRadiusObject?: BorderRadiusObject
  borderRadius?: number
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
}

export class ConnectedStep extends React.Component<Props> {
  static defaultProps = {
    active: true,
  }
  wrapper: any
  componentDidMount() {
    if (this.props.active) {
      this.register()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.active !== prevProps.active) {
      if (this.props.active) {
        this.register()
      } else {
        this.unregister()
      }
    }
  }

  componentWillUnmount() {
    this.unregister()
  }

  setNativeProps(obj: any) {
    this.wrapper.setNativeProps(obj)
  }

  register() {
    if (this.props.context && this.props.context.registerStep) {
      this.props.context.registerStep({
        target: this,
        wrapper: this.wrapper,
        ...this.props,
      })
    } else {
      console.warn('context undefined')
    }
  }

  unregister() {
    if (this.props.context.unregisterStep) {
      this.props.context.unregisterStep(this.props.name)
    } else {
      console.warn('unregisterStep undefined')
    }
  }

  measure() {
    if (typeof __TEST__ !== 'undefined' && __TEST__) {
      return new Promise((resolve) =>
        resolve({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        }),
      )
    }

    return new Promise((resolve, reject) => {
      const measure = () => {
        // Wait until the wrapper element appears
        if (this.wrapper && this.wrapper.measure) {
          this.wrapper.measure(
            (
              _ox: number,
              _oy: number,
              width: number,
              height: number,
              x: number,
              y: number,
            ) =>
              resolve({
                x,
                y,
                width,
                height,
              }),
            reject,
          )
        } else {
          requestAnimationFrame(measure)
        }
      }

      requestAnimationFrame(measure)
    })
  }

  render() {
    const copilot = {
      ref: (wrapper: any) => {
        this.wrapper = wrapper
      },
      onLayout: () => {}, // Android hack
    }

    return React.cloneElement(this.props.children, { copilot })
  }
}
