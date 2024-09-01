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
import { svgMaskPathMorph, IS_NATIVE } from '../utilities'
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
  nextSvgPath: string
  composedSvgPath: string
  viewBoxDimentions: string
}

const getSvgPath = () =>
  `M0,0H${Dimensions.get('window').width}V${
    Dimensions.get('window').height
  }H0V0ZM${Dimensions.get('window').width / 2},${
    Dimensions.get('window').height / 2
  } h 1 v 1 h -1 Z`
const getViewBoxDimentions = () =>
  `0 0 ${Dimensions.get('window').width} ${Dimensions.get('window').height}`

export class SvgMask extends Component<Props, State> {
  static defaultProps = {
    easing: Easing.linear,
    size: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    maskOffset: 0,
  }

  listenerID: string
  resizeListenerID: string | null
  rafID: number
  mask: React.RefObject<PathProps> = React.createRef()

  windowDimensions: ScaledSize
  dimensionsSubscription: any

  constructor(props: Props) {
    super(props)

    this.windowDimensions = Platform.select({
      android: Dimensions.get('screen'),
      default: Dimensions.get('window'),
    })

    this.state = {
      canvasSize: {
        x: this.windowDimensions.width,
        y: this.windowDimensions.height,
      },
      size: props.size,
      position: props.position,
      opacity: new Animated.Value(0),
      animation: new Animated.Value(0),
      previousPath: getSvgPath(),
      viewBoxDimentions: getViewBoxDimentions(),
      nextSvgPath: getSvgPath(),
      composedSvgPath: getSvgPath(),
    }

    this.listenerID = this.state.animation.addListener(this.animationListener)
  }

  componentDidMount() {
    IS_NATIVE
      ? (this.dimensionsSubscription = Dimensions.addEventListener(
          'change',
          this.recalculatePath,
        ))
      : window.addEventListener('resize', this.recalculatePath)
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.position !== this.props.position ||
      prevProps.size !== this.props.size
    ) {
      this.recalculatePath()
    }
  }

  componentWillUnmount() {
    if (this.listenerID) {
      this.state.animation.removeListener(this.listenerID)
    }
    if (this.rafID) {
      cancelAnimationFrame(this.rafID)
    }
    IS_NATIVE
      ? this.dimensionsSubscription?.remove()
      : window.removeEventListener('resize', this.recalculatePath)
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
        if (IS_NATIVE) {
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

  recalculatePath = () => {
    this.setState((state) => ({
      ...state,
      previousPath: getSvgPath(),
      viewBoxDimentions: getViewBoxDimentions(),
    }))
    this.setState((state) => ({ ...state, composedSvgPath: this.getPath() }))
    this.animate()
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
          viewBox={this.state.viewBoxDimentions}
        >
          <AnimatedSvgPath
            ref={this.mask}
            fill={this.props.backdropColor}
            strokeWidth={0}
            fillRule='evenodd'
            d={this.state.composedSvgPath}
            // @ts-ignore
            opacity={this.state.opacity._value as any}
          />
        </Svg>
      </Wrapper>
    )
  }
}
