import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
interface WrapperProps {
    copilot?: any;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export declare const Wrapper: ({ copilot, children, style }: WrapperProps) => JSX.Element;
export {};
