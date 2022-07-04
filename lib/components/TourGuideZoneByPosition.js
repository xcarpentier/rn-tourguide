import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TourGuideZone } from './TourGuideZone';
export const TourGuideZoneByPosition = ({ isTourGuide, zone, tourKey = '_default', width, height, top, left, right, bottom, shape, containerStyle, keepTooltipPosition, tooltipBottomOffset, borderRadiusObject, text, }) => {
    if (!isTourGuide) {
        return null;
    }
    return (React.createElement(View, { pointerEvents: 'none', style: [StyleSheet.absoluteFillObject, containerStyle] },
        React.createElement(TourGuideZone, { isTourGuide: true, ...{
                tourKey,
                zone,
                shape,
                keepTooltipPosition,
                tooltipBottomOffset,
                borderRadiusObject,
                text,
            }, style: {
                position: 'absolute',
                height,
                width,
                top,
                right,
                bottom,
                left,
            } })));
};
