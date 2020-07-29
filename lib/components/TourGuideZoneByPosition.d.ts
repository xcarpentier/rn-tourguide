/// <reference types="react" />
import { StyleProp, ViewStyle } from 'react-native';
import { Shape } from '../types';
interface TourGuideZoneByPositionProps {
    zone: number;
    isTourGuide?: boolean;
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    width?: number | string;
    height?: number | string;
    shape?: Shape;
    containerStyle?: StyleProp<ViewStyle>;
    keepTooltipPosition?: boolean;
}
export declare const TourGuideZoneByPosition: ({ isTourGuide, zone, width, height, top, left, right, bottom, shape, containerStyle, keepTooltipPosition, }: TourGuideZoneByPositionProps) => JSX.Element | null;
export {};
