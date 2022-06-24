import { BorderRadiusObject, IStep, Steps, SVGMaskPathMorphParam, SvgPath, ValueXY } from './types';
export declare const getFirstStep: (steps: Steps) => IStep | null;
export declare const getLastStep: (steps: Steps) => IStep | null;
export declare const getStepNumber: (steps: Steps, step?: IStep | undefined) => number | undefined;
export declare const getPrevStep: (steps: Steps, step?: IStep | undefined) => IStep | null;
export declare const getNextStep: (steps: Steps, step?: IStep | undefined) => IStep | null | undefined;
export declare const defaultSvgPath: ({ size, position, borderRadius: radius, borderRadiusObject, }: {
    size: ValueXY;
    position: ValueXY;
    borderRadius: number;
    borderRadiusObject?: BorderRadiusObject | undefined;
}) => SvgPath;
export declare const circleSvgPath: ({ size, position, }: {
    size: ValueXY;
    position: ValueXY;
}) => SvgPath;
export declare const svgMaskPathMorph: ({ previousPath, animation, to: { position, size, shape, maskOffset, borderRadius, borderRadiusObject }, }: SVGMaskPathMorphParam) => string;
