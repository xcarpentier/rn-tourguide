import * as React from 'react';
import { TourGuideZoneProps } from '../components/TourGuideZone';
import { TourGuideZoneByPositionProps } from '../components/TourGuideZoneByPosition';
export declare const useTourGuideController: (tourKey?: string | undefined) => {
    start: (fromStep?: number | undefined) => void;
    stop: () => void;
    eventEmitter: import("../components/TourGuideContext").Emitter | undefined;
    getCurrentStep: () => import("..").IStep | undefined;
    canStart: boolean | undefined;
    tourKey: string;
    TourGuideZone: React.FC<Omit<TourGuideZoneProps, "tourKey">>;
    TourGuideZoneByPosition: React.FC<Omit<TourGuideZoneByPositionProps, "tourKey">>;
};
