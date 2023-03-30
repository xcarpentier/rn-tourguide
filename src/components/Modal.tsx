import * as React from 'react'
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import {
  BorderRadiusObject,
  CustomPosition,
  IStep,
  Labels,
  ValueXY,
} from '../types'
import styles, { MARGIN } from './style'
import { SvgMask } from './SvgMask'
import { Tooltip, TooltipProps } from './Tooltip'

declare var __TEST__: boolean

export interface ModalProps {
  ref: any
  currentStep?: IStep
  visible?: boolean
  isFirstStep: boolean
  isLastStep: boolean
  animationDuration?: number
  tooltipComponent: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  borderRadius?: number
  borderRadiusObject?: BorderRadiusObject
  androidStatusBarVisible: boolean
  backdropColor: string
  labels: Labels
  dismissOnPress?: boolean
  easing: (value: number) => number
  stop: () => void
  next: () => void
  prev: () => void
  skipTo: (key: string, order: number) => void
  preventOutsideInteraction?: boolean
  customPosition?: Partial<CustomPosition>
}
interface Layout {
  x?: number
  y?: number
  width?: number
  height?: number
}

interface State {
  tooltip: object
  notAnimated?: boolean
  containerVisible: boolean
  layout?: Layout
  size?: ValueXY
  position?: ValueXY
  tooltipTranslateY: Animated.Value
  opacity: Animated.Value
}
interface Move {
  top: number
  left: number
  width: number
  height: number
}

export class Modal extends React.Component<ModalProps, State> {
  static defaultProps = {
    easing: Easing.elastic(0.7),
    animationDuration: 400,
    tooltipComponent: Tooltip as any,
    tooltipStyle: {},
    androidStatusBarVisible: false,
    backdropColor: 'rgba(0, 0, 0, 0.4)',
    labels: {},
    isHorizontal: false,
    preventOutsideInteraction: false,
  }

  layout?: Layout = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }

  state = {
    tooltip: {},
    containerVisible: false,
    tooltipTranslateY: new Animated.Value(0),
    opacity: new Animated.Value(0),
    layout: undefined,
    size: undefined,
    position: undefined,
  }

  constructor(props: ModalProps) {
    super(props)
  }

  componentDidUpdate(prevProps: ModalProps) {
    if (prevProps.visible === true && this.props.visible === false) {
      this.reset()
    }
  }

  handleLayoutChange = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    this.layout = layout
  }

  measure(): Promise<Layout> {
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

    return new Promise((resolve) => {
      const setLayout = () => {
        if (this.layout && this.layout.width !== 0) {
          resolve(this.layout)
        } else {
          requestAnimationFrame(setLayout)
        }
      }
      setLayout()
    })
  }
  _getLayoutPositions(
    layout: Layout,
    obj: Move = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
  ) {
    if (!this.props.androidStatusBarVisible && Platform.OS === 'android') {
      obj.top -= StatusBar.currentHeight || 30
    }
    const center = {
      x: obj.left + obj.width / 2,
      y: obj.top + obj.height / 2,
    }

    const relativeToLeft = center.x
    const relativeToTop = center.y
    const relativeToBottom = Math.abs(center.y - (layout.height || 0))
    const relativeToRight = Math.abs(center.x - (layout.width || 0))

    const verticalPosition = relativeToBottom > relativeToTop ? 'bottom' : 'top'
    const horizontalPosition =
      relativeToLeft > relativeToRight ? 'left' : 'right'

    return { verticalPosition, horizontalPosition }
  }

  async _animateMove(
    obj: Move = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    },
  ) {
    if (!this.props.currentStep) {
      return
    }
    const layout = await this.measure()
    const { verticalPosition, horizontalPosition } = this._getLayoutPositions(
      layout,
      obj,
    )

    const tooltip = {
      top: 0,
      tooltip: 0,
      bottom: 0,
      right: 0,
      maxWidth: 0,
      left: 0,
    }

    const customPosition = this.props!.currentStep!.customPosition || {}

    let customTop = 0
    let customBottom = 0

    if (!!customPosition.top) {
      customTop = customPosition.top
    }
    if (!!customPosition.bottom) {
      customBottom = customPosition.bottom
    }
    if (verticalPosition === 'bottom') {
      tooltip.top =
        obj.top + obj.height + MARGIN + (customTop || 0) - (customBottom || 0)
    } else {
      tooltip.bottom =
        layout.height! -
        (obj.top - MARGIN) +
        (customTop || 0) -
        (customBottom || 0)
    }

    if (horizontalPosition === 'left') {
      tooltip.right = Math.max(layout.width! - (obj.left + obj.width), 0)
      tooltip.right =
        tooltip.right === 0 ? tooltip.right + MARGIN : tooltip.right
      tooltip.maxWidth = layout.width! - tooltip.right - MARGIN
    } else {
      tooltip.left = Math.max(obj.left, 0)
      tooltip.left = tooltip.left === 0 ? tooltip.left + MARGIN : tooltip.left
      tooltip.maxWidth = layout.width! - tooltip.left - MARGIN
    }
    const duration = this.props.animationDuration! + 200
    const toValue =
      verticalPosition === 'bottom'
        ? tooltip.top
        : obj.top - MARGIN - 135 - (customBottom || 0)
    const translateAnim = Animated.timing(this.state.tooltipTranslateY, {
      toValue,
      duration,
      easing: this.props.easing,
      delay: duration + 100,
      useNativeDriver: true,
    })
    const opacityAnim = Animated.timing(this.state.opacity, {
      toValue: 1,
      duration,
      easing: this.props.easing,
      delay: duration,
      useNativeDriver: true,
    })
    if (!this.props.currentStep.keepTooltipPosition) {
      translateAnim.start(({ finished }) => {
        if (finished) {
          this.state.tooltipTranslateY.setValue(toValue)
        }
      })
      opacityAnim.start()
    } else {
      opacityAnim.start()
    }

    this.setState({
      tooltip,
      layout,
      size: {
        x: obj.width,
        y: obj.height,
      },
      position: {
        x: Math.floor(Math.max(obj.left, 0)),
        y: Math.floor(Math.max(obj.top, 0)),
      },
    })
  }

  animateMove(obj = {}): Promise<void> {
    return new Promise((resolve) => {
      this.setState({ containerVisible: true }, () =>
        this._animateMove(obj as any).then(resolve),
      )
    })
  }

  reset() {
    this.state.tooltipTranslateY.setValue(0)
    this.state.opacity.setValue(0)
    this.setState({
      containerVisible: false,
      layout: undefined,
      tooltip: {},
    })
  }

  handleNext = () => {
    this.state.opacity.setValue(0)
    this.props.next()
  }

  handlePrev = () => {
    this.state.opacity.setValue(0)
    this.props.prev()
  }

  handleStop = () => {
    this.props.stop()
    this.reset()
  }
  handleSkipTo = (key: string, order: number) => {
    this.state.opacity.setValue(0)
    this.props.skipTo(key, order)
  }

  renderMask = () => (
    <SvgMask
      style={styles.overlayContainer}
      size={this.state.size!}
      position={this.state.position!}
      easing={this.props.easing}
      animationDuration={this.props.animationDuration}
      backdropColor={this.props.backdropColor}
      currentStep={this.props.currentStep}
      maskOffset={this.props.maskOffset}
      borderRadius={this.props.borderRadius}
      dismissOnPress={this.props.dismissOnPress}
      stop={this.props.stop}
    />
  )

  renderTooltip() {
    const {
      tooltipComponent: TooltipComponent,
      visible,
      currentStep,
    } = this.props

    if (!visible) {
      return null
    }

    const obj = {
      // @ts-ignore
      left: this.state.position.x ? this.state!.position!.x! : 0,
      // @ts-ignore
      top: this.state.position.y ? this.state!.position!.y! : 0,
      // @ts-ignore
      width: this.state.size.x ? this.state!.size!.x! : 0,
      // @ts-ignore
      height: this.state.size.y ? this.state!.size!.y! : 0,
    }

    const { verticalPosition } = this._getLayoutPositions(this.layout!, obj)

    const { opacity } = this.state
    return (
      <Animated.View
        pointerEvents='box-none'
        key='tooltip'
        style={[
          styles.tooltip,
          this.props.tooltipStyle,
          {
            zIndex: 99,
            opacity,
            transform: [{ translateY: this.state.tooltipTranslateY }],
            // @ts-ignore
            ...(!!currentStep.customPosition.left && {
              left: currentStep!.customPosition!.left,
            }),
            // @ts-ignore
            ...(!!currentStep.customPosition.right && {
              right: currentStep!.customPosition!.right,
            }),
          },
        ]}
      >
        <TooltipComponent
          isFirstStep={this.props.isFirstStep}
          isLastStep={this.props.isLastStep}
          currentStep={this.props.currentStep!}
          handleNext={this.handleNext}
          handlePrev={this.handlePrev}
          handleStop={this.handleStop}
          handleSkipTo={this.handleSkipTo}
          labels={this.props.labels}
          // @ts-ignore
          enableArrow={currentStep.enableArrow || true}
          // @ts-ignore
          arrowHorizontalOffset={currentStep.arrowHorizontalOffset || undefined}
          verticalPosition={verticalPosition}
        />
      </Animated.View>
    )
  }

  renderNonInteractionPlaceholder() {
    return this.props.visible && this.props.preventOutsideInteraction ? (
      <View
        style={[StyleSheet.absoluteFill, styles.nonInteractionPlaceholder]}
      />
    ) : null
  }

  render() {
    const containerVisible = this.state.containerVisible || this.props.visible
    const contentVisible = this.state.layout && containerVisible

    if (!containerVisible) {
      return null
    }

    return (
      <View
        style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
        pointerEvents='box-none'
      >
        <View
          style={styles.container}
          onLayout={this.handleLayoutChange}
          pointerEvents='box-none'
        >
          {contentVisible && (
            <>
              {this.renderMask()}
              {this.renderNonInteractionPlaceholder()}
              {this.renderTooltip()}
            </>
          )}
        </View>
      </View>
    )
  }
}
