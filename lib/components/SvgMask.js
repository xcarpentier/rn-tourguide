import React, { Component } from 'react';
import { Animated, Dimensions, Easing, Platform, View, TouchableWithoutFeedback, } from 'react-native';
import Svg from 'react-native-svg';
import { svgMaskPathMorph } from '../utilities';
import { AnimatedSvgPath } from './AnimatedPath';
const IS_WEB = Platform.OS !== 'web';
export class SvgMask extends Component {
    constructor(props) {
        super(props);
        this.mask = React.createRef();
        this.windowDimensions = null;
        this.getPath = () => {
            const { previousPath, animation } = this.state;
            const { size, position, currentStep, maskOffset, borderRadius } = this.props;
            return svgMaskPathMorph({
                animation: animation,
                previousPath,
                to: {
                    position,
                    size,
                    shape: currentStep === null || currentStep === void 0 ? void 0 : currentStep.shape,
                    maskOffset: (currentStep === null || currentStep === void 0 ? void 0 : currentStep.maskOffset) || maskOffset,
                    borderRadius: (currentStep === null || currentStep === void 0 ? void 0 : currentStep.borderRadius) || borderRadius,
                    borderRadiusObject: currentStep === null || currentStep === void 0 ? void 0 : currentStep.borderRadiusObject,
                },
            });
        };
        this.animationListener = () => {
            const d = this.getPath();
            this.rafID = requestAnimationFrame(() => {
                if (this.mask && this.mask.current) {
                    if (IS_WEB) {
                        this.mask.current.setNativeProps({ d });
                    }
                    else {
                        this.mask.current._touchableNode.setAttribute('d', d);
                    }
                }
            });
        };
        this.animate = () => {
            const animations = [
                Animated.timing(this.state.animation, {
                    toValue: 1,
                    duration: this.props.animationDuration,
                    easing: this.props.easing,
                    useNativeDriver: false,
                }),
            ];
            if (this.state.opacity._value !== 1) {
                animations.push(Animated.timing(this.state.opacity, {
                    toValue: 1,
                    duration: this.props.animationDuration,
                    easing: this.props.easing,
                    useNativeDriver: true,
                }));
            }
            Animated.parallel(animations, { stopTogether: false }).start((result) => {
                if (result.finished) {
                    this.setState({ previousPath: this.getPath() }, () => {
                        if (this.state.animation._value === 1) {
                            this.state.animation.setValue(0);
                        }
                    });
                }
            });
        };
        this.handleLayout = ({ nativeEvent: { layout: { width, height }, }, }) => {
            this.setState({
                canvasSize: {
                    x: width,
                    y: height,
                },
            });
        };
        this.windowDimensions = Platform.select({
            android: Dimensions.get('screen'),
            default: Dimensions.get('window'),
        });
        this.firstPath = `M0,0H${this.windowDimensions.width}V${this.windowDimensions.height}H0V0ZM${this.windowDimensions.width / 2},${this.windowDimensions.height / 2} h 1 v 1 h -1 Z`;
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
        };
        this.listenerID = this.state.animation.addListener(this.animationListener);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.position !== this.props.position ||
            prevProps.size !== this.props.size) {
            this.animate();
        }
    }
    componentWillUnmount() {
        if (this.listenerID) {
            this.state.animation.removeListener(this.listenerID);
        }
        if (this.rafID) {
            cancelAnimationFrame(this.rafID);
        }
    }
    render() {
        if (!this.state.canvasSize) {
            return null;
        }
        const { dismissOnPress, stop } = this.props;
        const Wrapper = dismissOnPress ? TouchableWithoutFeedback : View;
        return (React.createElement(Wrapper, { style: this.props.style, onLayout: this.handleLayout, pointerEvents: 'none', onPress: dismissOnPress ? stop : undefined },
            React.createElement(Svg, { pointerEvents: 'none', width: this.state.canvasSize.x, height: this.state.canvasSize.y },
                React.createElement(AnimatedSvgPath, { ref: this.mask, fill: this.props.backdropColor, strokeWidth: 0, fillRule: 'evenodd', d: this.firstPath, opacity: this.state.opacity }))));
    }
}
SvgMask.defaultProps = {
    easing: Easing.linear,
    size: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    maskOffset: 0,
};
