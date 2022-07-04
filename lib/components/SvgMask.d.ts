import React, { Component } from 'react';
import { Animated, LayoutChangeEvent, StyleProp, ViewStyle, ScaledSize } from 'react-native';
import { PathProps } from 'react-native-svg';
import { IStep, ValueXY } from '../types';
interface Props {
    size: ValueXY;
    position: ValueXY;
    style: StyleProp<ViewStyle>;
    animationDuration?: number;
    backdropColor: string;
    dismissOnPress?: boolean;
    maskOffset?: number;
    borderRadius?: number;
    currentStep?: IStep;
    easing: (value: number) => number;
    stop: () => void;
}
interface State {
    size: ValueXY;
    position: ValueXY;
    opacity: Animated.Value;
    animation: Animated.Value;
    canvasSize: ValueXY;
    previousPath: string;
}
export declare class SvgMask extends Component<Props, State> {
    static defaultProps: {
        easing: import("react-native").EasingFunction;
        size: {
            x: number;
            y: number;
        };
        position: {
            x: number;
            y: number;
        };
        maskOffset: number;
    };
    listenerID: string;
    rafID: number;
    mask: React.RefObject<PathProps>;
    windowDimensions: ScaledSize | null;
    firstPath: string | undefined;
    constructor(props: Props);
    componentDidUpdate(prevProps: Props): void;
    componentWillUnmount(): void;
    getPath: () => string;
    animationListener: () => void;
    animate: () => void;
    handleLayout: ({ nativeEvent: { layout: { width, height }, }, }: LayoutChangeEvent) => void;
    render(): JSX.Element | null;
}
export {};
