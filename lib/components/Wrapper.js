import * as React from 'react';
import { View } from 'react-native';
export const Wrapper = ({ copilot, children, style }) => (React.createElement(View, { style: style, ...copilot }, children));
