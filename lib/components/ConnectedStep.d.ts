import * as React from 'react';
import { Shape } from '../types';
import { ITourGuideContext } from './TourGuideContext';
interface Props {
    name: string;
    text: string;
    order: number;
    active?: boolean;
    shape?: Shape;
    context: ITourGuideContext;
    children?: any;
    maskOffset?: number;
    borderRadius?: number;
    keepTooltipPosition?: boolean;
}
export declare class ConnectedStep extends React.Component<Props> {
    static defaultProps: {
        active: boolean;
    };
    wrapper: any;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    componentWillUnmount(): void;
    setNativeProps(obj: any): void;
    register(): void;
    unregister(): void;
    measure(): Promise<unknown>;
    render(): React.FunctionComponentElement<{
        copilot: {
            ref: (wrapper: any) => void;
            onLayout: () => void;
        };
    }>;
}
export {};
