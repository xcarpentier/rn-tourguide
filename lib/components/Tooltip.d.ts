import { IStep, Labels } from '../types';
export interface TooltipProps {
    isFirstStep?: boolean;
    isLastStep?: boolean;
    currentStep: IStep;
    labels?: Labels;
    handleNext?: () => void;
    handlePrev?: () => void;
    handleStop?: () => void;
}
export declare const Tooltip: ({ isFirstStep, isLastStep, handleNext, handlePrev, handleStop, currentStep, labels, }: TooltipProps) => JSX.Element;
