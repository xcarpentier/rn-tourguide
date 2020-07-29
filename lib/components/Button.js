import * as React from 'react';
import { View, Text } from 'react-native';
import styles from './style';
export const Button = ({ wrapperStyle, style, children, ...rest }) => (React.createElement(View, { style: [styles.button, wrapperStyle] },
    React.createElement(Text, Object.assign({ style: [styles.buttonText, style] }, rest), children)));
