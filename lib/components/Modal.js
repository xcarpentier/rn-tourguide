import * as React from 'react';
import { Animated, Easing, Platform, StatusBar, StyleSheet, View, } from 'react-native';
import styles, { MARGIN } from './style';
import { SvgMask } from './SvgMask';
import { Tooltip } from './Tooltip';
export class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.layout = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
        this.state = {
            tooltip: {},
            containerVisible: false,
            tooltipTranslateY: new Animated.Value(400),
            opacity: new Animated.Value(0),
            layout: undefined,
            size: undefined,
            position: undefined,
        };
        this.handleLayoutChange = ({ nativeEvent: { layout } }) => {
            this.layout = layout;
        };
        this.handleNext = () => {
            this.props.next();
        };
        this.handlePrev = () => {
            this.props.prev();
        };
        this.handleStop = () => {
            this.reset();
            this.props.stop();
        };
        this.renderMask = () => (React.createElement(SvgMask, { style: styles.overlayContainer, size: this.state.size, position: this.state.position, easing: this.props.easing, animationDuration: this.props.animationDuration, backdropColor: this.props.backdropColor, currentStep: this.props.currentStep, maskOffset: this.props.maskOffset, borderRadius: this.props.borderRadius, dismissOnPress: this.props.dismissOnPress, stop: this.props.stop }));
    }
    componentDidUpdate(prevProps) {
        if (prevProps.visible === true && this.props.visible === false) {
            this.reset();
        }
    }
    measure() {
        if (typeof __TEST__ !== 'undefined' && __TEST__) {
            return new Promise((resolve) => resolve({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }));
        }
        return new Promise((resolve) => {
            const setLayout = () => {
                if (this.layout && this.layout.width !== 0) {
                    resolve(this.layout);
                }
                else {
                    requestAnimationFrame(setLayout);
                }
            };
            setLayout();
        });
    }
    async _animateMove(obj = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    }) {
        var _a;
        const layout = await this.measure();
        if (!this.props.androidStatusBarVisible && Platform.OS === 'android') {
            obj.top -= StatusBar.currentHeight || 30;
        }
        const center = {
            x: obj.left + obj.width / 2,
            y: obj.top + obj.height / 2,
        };
        const relativeToLeft = center.x;
        const relativeToTop = center.y;
        const relativeToBottom = Math.abs(center.y - layout.height);
        const relativeToRight = Math.abs(center.x - layout.width);
        const verticalPosition = relativeToBottom > relativeToTop ? 'bottom' : 'top';
        const horizontalPosition = relativeToLeft > relativeToRight ? 'left' : 'right';
        const tooltip = {
            top: 0,
            tooltip: 0,
            bottom: 0,
            right: 0,
            maxWidth: 0,
            left: 0,
        };
        if (verticalPosition === 'bottom') {
            tooltip.top = obj.top + obj.height + MARGIN;
        }
        else {
            tooltip.bottom = layout.height - (obj.top - MARGIN);
        }
        if (horizontalPosition === 'left') {
            tooltip.right = Math.max(layout.width - (obj.left + obj.width), 0);
            tooltip.right =
                tooltip.right === 0 ? tooltip.right + MARGIN : tooltip.right;
            tooltip.maxWidth = layout.width - tooltip.right - MARGIN;
        }
        else {
            tooltip.left = Math.max(obj.left, 0);
            tooltip.left = tooltip.left === 0 ? tooltip.left + MARGIN : tooltip.left;
            tooltip.maxWidth = layout.width - tooltip.left - MARGIN;
        }
        const duration = this.props.animationDuration + 200;
        const toValue = verticalPosition === 'bottom'
            ? tooltip.top
            : obj.top -
                MARGIN -
                135 -
                (this.props.currentStep.tooltipBottomOffset || 0);
        const translateAnim = Animated.timing(this.state.tooltipTranslateY, {
            toValue,
            duration,
            easing: this.props.easing,
            delay: this.props.persistTooltip ? 0 : duration,
            useNativeDriver: true,
        });
        const opacityAnim = Animated.timing(this.state.opacity, {
            toValue: 1,
            duration,
            easing: this.props.easing,
            delay: duration,
            useNativeDriver: true,
        });
        const animations = [];
        if (toValue !== this.state.tooltipTranslateY._value &&
            !((_a = this.props.currentStep) === null || _a === void 0 ? void 0 : _a.keepTooltipPosition)) {
            animations.push(translateAnim);
        }
        if (!this.props.persistTooltip) {
            this.state.opacity.setValue(0);
            animations.push(opacityAnim);
        }
        else if (this.state.opacity._value !== 1) {
            animations.push(opacityAnim);
        }
        Animated.parallel(animations).start();
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
        });
    }
    animateMove(obj = {}) {
        return new Promise((resolve) => {
            this.setState({ containerVisible: true }, () => this._animateMove(obj).then(resolve));
        });
    }
    reset() {
        this.setState({
            containerVisible: false,
            layout: undefined,
        });
    }
    renderTooltip() {
        const { tooltipComponent: TooltipComponent, visible } = this.props;
        if (!visible) {
            return null;
        }
        const { opacity } = this.state;
        return (React.createElement(Animated.View, { pointerEvents: 'box-none', key: 'tooltip', style: [
                styles.tooltip,
                this.props.tooltipStyle,
                {
                    zIndex: 99,
                    opacity,
                    transform: [{ translateY: this.state.tooltipTranslateY }],
                },
            ] },
            React.createElement(TooltipComponent, { isFirstStep: this.props.isFirstStep, isLastStep: this.props.isLastStep, currentStep: this.props.currentStep, handleNext: this.handleNext, handlePrev: this.handlePrev, handleStop: this.handleStop, labels: this.props.labels })));
    }
    renderNonInteractionPlaceholder() {
        return this.props.preventOutsideInteraction ? React.createElement(View, { style: [StyleSheet.absoluteFill, styles.nonInteractionPlaceholder] }) : null;
    }
    render() {
        const containerVisible = this.state.containerVisible || this.props.visible;
        const contentVisible = this.state.layout && containerVisible;
        if (!containerVisible) {
            return null;
        }
        return (React.createElement(View, { style: [StyleSheet.absoluteFill, { backgroundColor: 'transparent' }], pointerEvents: 'box-none' },
            React.createElement(View, { style: styles.container, onLayout: this.handleLayoutChange, pointerEvents: 'box-none' }, contentVisible && (React.createElement(React.Fragment, null,
                this.renderMask(),
                this.renderNonInteractionPlaceholder(),
                this.renderTooltip())))));
    }
}
Modal.defaultProps = {
    easing: Easing.elastic(0.7),
    animationDuration: 400,
    tooltipComponent: Tooltip,
    tooltipStyle: {},
    androidStatusBarVisible: false,
    backdropColor: 'rgba(0, 0, 0, 0.4)',
    labels: {},
    isHorizontal: false,
    preventOutsideInteraction: false,
};
