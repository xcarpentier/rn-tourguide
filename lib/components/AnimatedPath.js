import { Animated, Platform } from 'react-native';
import { Path } from 'react-native-svg';
export const AnimatedSvgPath = Platform.select({
    default: Animated.createAnimatedComponent(Path),
    web: Path,
});
