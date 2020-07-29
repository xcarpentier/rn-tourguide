import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { TourGuideZone } from './TourGuideZone';
export const TourGuideZoneByPosition = ({ isTourGuide, zone, width, height, top, left, right, bottom, shape, containerStyle, keepTooltipPosition, }) => {
    if (!isTourGuide) {
        return null;
    }
    return (React.createElement(View, { pointerEvents: 'none', style: [StyleSheet.absoluteFillObject, containerStyle] },
        React.createElement(TourGuideZone, Object.assign({ isTourGuide: true }, { zone, shape, keepTooltipPosition }, { style: {
                height,
                width,
                top,
                right,
                bottom,
                left,
            } }))));
};
