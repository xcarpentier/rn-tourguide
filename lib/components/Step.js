import * as React from 'react';
import { ConnectedStep } from './ConnectedStep';
import { TourGuideContext } from './TourGuideContext';
export const Step = (props) => {
    const context = React.useContext(TourGuideContext);
    return React.createElement(ConnectedStep, { ...{ ...props, context } });
};
