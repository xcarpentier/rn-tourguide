import * as React from 'react';
import { Step } from './Step';
import { Wrapper } from './Wrapper';
export const TourGuideZone = ({ isTourGuide = true, zone, children, shape, text, maskOffset, borderRadius, style, keepTooltipPosition, }) => {
    if (!isTourGuide) {
        return React.createElement(React.Fragment, null, children);
    }
    return (React.createElement(Step, Object.assign({ text: text !== null && text !== void 0 ? text : `Zone ${zone}`, order: zone, name: `${zone}` }, { shape, maskOffset, borderRadius, keepTooltipPosition }),
        React.createElement(Wrapper, Object.assign({}, { style }), children)));
};
