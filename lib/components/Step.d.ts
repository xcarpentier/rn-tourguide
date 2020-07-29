import * as React from 'react';
import { Shape } from '../types';
interface Props {
    name: string;
    order: number;
    text: string;
    shape?: Shape;
    active?: boolean;
    maskOffset?: number;
    borderRadius?: number;
    children: React.ReactNode;
    keepTooltipPosition?: boolean;
}
export declare const Step: (props: Props) => JSX.Element;
export {};
