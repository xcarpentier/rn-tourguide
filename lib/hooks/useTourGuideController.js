import * as React from 'react';
import { TourGuideContext } from '../components/TourGuideContext';
import { TourGuideZone } from '../components/TourGuideZone';
import { TourGuideZoneByPosition, } from '../components/TourGuideZoneByPosition';
export const useTourGuideController = (tourKey) => {
    const { start, canStart, stop, eventEmitter, getCurrentStep, setTourKey } = React.useContext(TourGuideContext);
    let key = tourKey !== null && tourKey !== void 0 ? tourKey : '_default';
    const _start = (fromStep) => {
        setTourKey && setTourKey(key);
        if (start) {
            start(key, fromStep);
        }
    };
    const _stop = () => {
        if (stop) {
            stop(key);
        }
    };
    const _eventEmitter = eventEmitter ? eventEmitter[key] : undefined;
    const _canStart = canStart ? canStart[key] : undefined;
    const _getCurrentStep = () => {
        if (getCurrentStep) {
            return getCurrentStep(key);
        }
        return undefined;
    };
    React.useEffect(() => {
        setTourKey && setTourKey(key);
    }, []);
    const KeyedTourGuideZone = React.useCallback(({ children, ...rest }) => {
        return (React.createElement(TourGuideZone, { ...rest, tourKey: key }, children));
    }, [key]);
    const KeyedTourGuideZoneByPosition = React.useCallback((props) => {
        return React.createElement(TourGuideZoneByPosition, { ...props, tourKey: key });
    }, [key]);
    return {
        start: _start,
        stop: _stop,
        eventEmitter: _eventEmitter,
        getCurrentStep: _getCurrentStep,
        canStart: _canStart,
        tourKey: key,
        TourGuideZone: KeyedTourGuideZone,
        TourGuideZoneByPosition: KeyedTourGuideZoneByPosition,
    };
};
