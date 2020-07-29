import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Labels } from '../types';
import { TooltipProps } from './Tooltip';
export interface TourGuideProviderProps {
    tooltipComponent?: React.ComponentType<TooltipProps>;
    tooltipStyle?: StyleProp<ViewStyle>;
    labels?: Labels;
    androidStatusBarVisible?: boolean;
    startAtMount?: boolean;
    backdropColor?: string;
    verticalOffset?: number;
    wrapperStyle?: StyleProp<ViewStyle>;
    maskOffset?: number;
    borderRadius?: number;
    animationDuration?: number;
    children: React.ReactNode;
}
export declare const TourGuideProvider: ({ children, wrapperStyle, labels, tooltipComponent, tooltipStyle, androidStatusBarVisible, backdropColor, animationDuration, maskOffset, borderRadius, verticalOffset, startAtMount, }: TourGuideProviderProps) => JSX.Element;
