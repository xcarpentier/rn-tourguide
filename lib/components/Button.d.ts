import { StyleProp, ViewStyle } from 'react-native';
interface Props {
    wrapperStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    children?: any;
}
export declare const Button: ({ wrapperStyle, style, children, ...rest }: Props) => JSX.Element;
export {};
