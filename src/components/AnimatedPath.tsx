import * as React from 'react'
import { Animated, Platform } from 'react-native'
import { Path, PathProps } from 'react-native-svg'

export const AnimatedSvgPath: React.ComponentType<
  PathProps & { ref: any }
> = Platform.select({
  default: Animated.createAnimatedComponent(Path),
  web: Path,
})
