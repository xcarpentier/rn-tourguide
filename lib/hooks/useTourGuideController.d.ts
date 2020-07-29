export declare const useTourGuideController: () => {
    start: ((fromStep?: number | undefined) => void) | undefined;
    stop: (() => void) | undefined;
    eventEmitter: import("../components/TourGuideContext").Emitter | undefined;
    getCurrentStep: (() => import("..").IStep | undefined) | undefined;
    canStart: boolean;
};
