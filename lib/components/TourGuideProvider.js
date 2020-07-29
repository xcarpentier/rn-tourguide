import mitt from 'mitt';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { TourGuideContext } from '../components/TourGuideContext';
import { useIsMounted } from '../hooks/useIsMounted';
import * as utils from '../utilities';
import { Modal } from './Modal';
import { OFFSET_WIDTH } from './style';
const { useMemo, useEffect, useState, useRef } = React;
const MAX_START_TRIES = 120;
export const TourGuideProvider = ({ children, wrapperStyle, labels, tooltipComponent, tooltipStyle, androidStatusBarVisible, backdropColor, animationDuration, maskOffset, borderRadius, verticalOffset, startAtMount = false, }) => {
    const [visible, setVisible] = useState(undefined);
    const [currentStep, updateCurrentStep] = useState();
    const [steps, setSteps] = useState({});
    const [canStart, setCanStart] = useState(false);
    const startTries = useRef(0);
    const mounted = useIsMounted();
    const eventEmitter = useMemo(() => new mitt(), []);
    const modal = useRef();
    useEffect(() => {
        if (mounted && visible === false) {
            eventEmitter.emit('stop');
        }
    }, [visible]);
    useEffect(() => {
        if (visible || currentStep) {
            moveToCurrentStep();
        }
    }, [visible, currentStep]);
    useEffect(() => {
        if (mounted && Object.entries(steps).length > 0) {
            setCanStart(true);
            if (startAtMount) {
                start();
            }
        }
    }, [mounted, steps]);
    const moveToCurrentStep = async () => {
        var _a;
        const size = await currentStep.target.measure();
        await ((_a = modal.current) === null || _a === void 0 ? void 0 : _a.animateMove({
            width: size.width + OFFSET_WIDTH,
            height: size.height + OFFSET_WIDTH,
            left: size.x - OFFSET_WIDTH / 2,
            top: size.y - OFFSET_WIDTH / 2 + (verticalOffset || 0),
        }));
    };
    const setCurrentStep = (step) => new Promise((resolve) => {
        updateCurrentStep(() => {
            eventEmitter.emit('stepChange', step);
            resolve();
            return step;
        });
    });
    const getNextStep = (step = currentStep) => utils.getNextStep(steps, step);
    const getPrevStep = (step = currentStep) => utils.getPrevStep(steps, step);
    const getFirstStep = () => utils.getFirstStep(steps);
    const getLastStep = () => utils.getLastStep(steps);
    const isFirstStep = useMemo(() => currentStep === getFirstStep(), [
        currentStep,
    ]);
    const isLastStep = useMemo(() => currentStep === getLastStep(), [currentStep]);
    const next = () => setCurrentStep(getNextStep());
    const prev = () => setCurrentStep(getPrevStep());
    const stop = () => {
        setVisible(false);
        setCurrentStep(undefined);
    };
    const registerStep = (step) => {
        setSteps((previousSteps) => {
            return {
                ...previousSteps,
                [step.name]: step,
            };
        });
    };
    const unregisterStep = (stepName) => {
        if (!mounted) {
            return;
        }
        setSteps(Object.entries(steps)
            .filter(([key]) => key !== stepName)
            .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {}));
    };
    const getCurrentStep = () => currentStep;
    const start = async (fromStep) => {
        const currentStep = fromStep
            ? steps[fromStep]
            : getFirstStep();
        if (startTries.current > MAX_START_TRIES) {
            startTries.current = 0;
            return;
        }
        if (!currentStep) {
            startTries.current += 1;
            requestAnimationFrame(() => start(fromStep));
        }
        else {
            eventEmitter.emit('start');
            await setCurrentStep(currentStep);
            setVisible(true);
            startTries.current = 0;
        }
    };
    return (React.createElement(View, { style: [styles.container, wrapperStyle] },
        React.createElement(TourGuideContext.Provider, { value: {
                eventEmitter,
                registerStep,
                unregisterStep,
                getCurrentStep,
                start,
                stop,
                canStart,
            } },
            children,
            React.createElement(Modal, Object.assign({ ref: modal }, {
                next,
                prev,
                stop,
                visible,
                isFirstStep,
                isLastStep,
                currentStep,
                labels,
                tooltipComponent,
                tooltipStyle,
                androidStatusBarVisible,
                backdropColor,
                animationDuration,
                maskOffset,
                borderRadius,
            })))));
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
