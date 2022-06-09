import React, { Component } from 'react'
import {
  Animated,
  Dimensions,
  Easing,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  ScaledSize,
} from 'react-native'
import Svg, { PathProps } from 'react-native-svg'
import { IStep, ValueXY } from '../types'
import { svgMaskPathMorph } from '../utilities'
import { AnimatedSvgPath } from './AnimatedPath'

interface Props {
  size: ValueXY
  position: ValueXY
  style: StyleProp<ViewStyle>
  animationDuration?: number
  backdropColor: string
  dismissOnPress?: boolean
  maskOffset?: number
  borderRadius?: number
  currentStep?: IStep
  easing: (value: number) => number
  stop: () => void
}

interface State {
  size: ValueXY
  position: ValueXY
  opacity: Animated.Value
  animation: Animated.Value
  canvasSize: ValueXY
  previousPath: string
}

const IS_WEB = Platform.OS !== 'web'

export class SvgMask extends Component<Props, State> {
  static defaultProps = {
    easing: Easing.linear,
    size: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    maskOffset: 0,
  }

  listenerID: string
  rafID: number
  mask: React.RefObject<PathProps> = React.createRef()

  windowDimensions: ScaledSize | null = null
  firstPath: string | undefined

  constructor(props: Props) {
    super(props)

    this.windowDimensions = Platform.select({
      android: Dimensions.get('screen'),
      default: Dimensions.get('window'),
    })

    this.firstPath = `M0,0H${this.windowDimensions.width}V${
      this.windowDimensions.height
    }H0V0ZM${this.windowDimensions.width / 2},${
      this.windowDimensions.height / 2
    } h 1 v 1 h -1 Z`

    this.state = {
      canvasSize: {
        x: this.windowDimensions.width,
        y: this.windowDimensions.height,
      },
      size: props.size,
      position: props.position,
      opacity: new Animated.Value(0),
      animation: new Animated.Value(0),
      previousPath: this.firstPath,
    }

    this.listenerID = this.state.animation.addListener(this.animationListener)
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.position !== this.props.position ||
      prevProps.size !== this.props.size
    ) {
      this.animate()
    }
  }

  componentWillUnmount() {
    if (this.listenerID) {
      this.state.animation.removeListener(this.listenerID)
    }
    if (this.rafID) {
      cancelAnimationFrame(this.rafID)
    }
  }

  getPath = () => {
    const { previousPath, animation } = this.state
    const { size, position, currentStep, maskOffset, borderRadius } = this.props

    return svgMaskPathMorph({
      animation: animation as any,
      previousPath,
      to: {
        position,
        size,
        shape: currentStep?.shape,
        maskOffset: currentStep?.maskOffset || maskOffset,
        borderRadius: currentStep?.borderRadius || borderRadius,
        borderRadiusObject: currentStep?.borderRadiusObject,
      },
    })
  }

  animationListener = () => {
    const d = this.getPath()
    this.rafID = requestAnimationFrame(() => {
      if (this.mask && this.mask.current) {
        if (IS_WEB) {
          // @ts-ignore
          this.mask.current.setNativeProps({ d })
        } else {
          // @ts-ignore
          this.mask.current._touchableNode.setAttribute('d', d)
        }
      }
    })
  }

  animate = () => {
    const animations = [
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: this.props.animationDuration,
        easing: this.props.easing,
        useNativeDriver: false,
      }),
    ]
    // @ts-ignore
    if (this.state.opacity._value !== 1) {
      animations.push(
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: this.props.animationDuration,
          easing: this.props.easing,
          useNativeDriver: true,
        }),
      )
    }
    Animated.parallel(animations, { stopTogether: false }).start((result) => {
      if (result.finished) {
        this.setState({ previousPath: this.getPath() }, () => {
          // @ts-ignore
          if (this.state.animation._value === 1) {
            this.state.animation.setValue(0)
          }
        })
      }
    })
  }

  handleLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }: LayoutChangeEvent) => {
    this.setState({
      canvasSize: {
        x: width,
        y: height,
      },
    })
  }

  render() {
    if (!this.state.canvasSize) {
      return null
    }
    const { dismissOnPress, stop } = this.props
    const Wrapper: any = dismissOnPress ? TouchableWithoutFeedback : View

    return (
      <Wrapper
        style={this.props.style}
        onLayout={this.handleLayout}
        pointerEvents='none'
        onPress={dismissOnPress ? stop : undefined}
      >
        <Svg
          pointerEvents='none'
          width={this.state.canvasSize.x}
          height={this.state.canvasSize.y}
        >
          <AnimatedSvgPath
            ref={this.mask}
            fill={this.props.backdropColor}
            strokeWidth={0}
            fillRule='evenodd'
            d={this.firstPath}
            opacity={this.state.opacity as any}
          />
        </Svg>
      </Wrapper>
    )
  }
}
