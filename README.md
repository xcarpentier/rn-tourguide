<h1 align="center">RN-TourGuide</h1>

<p align="center">
  A flexible <strong>tourguide</strong> for your react native app!
  <br/><small>(a rewriting of react-native-copilot)</small>
</p>

<p align="center">
  <img width="250" src="https://www.dropbox.com/s/9heua3qgd66125k/rn-tourguide.gif?dl=0&raw=1" alt="RN Tourguide" />
</p>

<div align="center">
  <p align="center">
    <a href="https://www.npmjs.com/package/rn-tourguide">
      <img alt="npm downloads" src="https://img.shields.io/npm/dm/rn-tourguide.svg"/>
    </a>
    <a href="https://www.npmjs.com/package/rn-tourguide">
      <img src="https://img.shields.io/npm/v/rn-tourguide.svg" alt="NPM Version" />
    </a>
    <a href="http://reactnative.gallery/xcarpentier/rn-tourguide">
      <img src="https://img.shields.io/badge/reactnative.gallery-%F0%9F%8E%AC-green.svg"/></a>
    </a>
    <a href="#hire-an-expert">
      <img src="https://img.shields.io/badge/%F0%9F%92%AA-hire%20an%20expert-brightgreen"/>
    </a>
  </p>
</div>

## Installation

```
yarn add rn-tourguide
```

```
yarn add react-native-svg
react-native link react-native-svg
```

If you are using Expo:

```
expo install react-native-svg
```

## Usage

Use the `copilot()` higher order component for the screen component that you want to use copilot with:

```js
import { copilot } from 'rn-tourguide'

class HomeScreen extends Component {
  /* ... */
}

export default copilot()(HomeScreen)
```

Example

```js
import { copilot, TourGuideZone, CopilotWrapper } from 'rn-tourguide'

class HomeScreen {
  render() {
    return (
      <View>
        <TourGuideZone
          zone={1}
          isTourGuide
          text={'Tooltip 1'}
          borderRadius={16}
        >
          <CopilotWrapper>
            <Text style={styles.title}>
              {'Welcome to the demo of\n"rn-tourguide"'}
            </Text>
          </CopilotWrapper>
        </TourGuideZone>
        <TourGuideZone
          zone={2}
          isTourGuide
          text={'Tooltip 2, circle shape'}
          shape={'circle'}
        >
          <CopilotWrapper>
            <Text style={styles.title}>
              {'Welcome to the demo of\n"rn-tourguide"'}
            </Text>
          </CopilotWrapper>
        </TourGuideZone>
      </View>
    )
  }
}
```

`TourGuide` props:

```ts
interface TourGuideZoneProps {
  zone: number // A positive number indicating the order of the step in the entire walkthrough.
  isTourGuide?: boolean // return children without wrapping id false
  text?: string // text in tooltip
  shape?: Shape // which shape
  maskOffset?: number // offset around zone
  borderRadius?: number // round corner when rectangle
  children: React.ReactNode
}

type Shape = 'circle' | 'rectangle' | 'circle_and_keep' | 'rectangle_and_keep'

interface CopilotOptionProps {
  tooltipComponent?: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  animated?: boolean
  labels?: Labels
  androidStatusBarVisible?: boolean
  backdropColor?: string
  stopOnOutsideClick?: boolean
  verticalOffset?: number
  wrapperStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  animationDuration?: number
}

interface TooltipProps {
  isFirstStep?: boolean
  isLastStep?: boolean
  currentStep: Step
  labels?: Labels
  handleNext?(): void
  handlePrev?(): void
  handleStop?(): void
}

interface Labels {
  skip?: string
  previous?: string
  next?: string
  finish?: string
}
```

In order to start the tutorial, you can call the `start` prop function in the root component that is injected by `copilot`:

```js
class HomeScreen extends Component {
  handleStartButtonPress() {
    this.props.start()
  }

  render() {
    // ...
  }
}

export default copilot()(HomeScreen)
```

If you are looking for a working example, please check out [this link](https://github.com/xcarpentier/rn-tourguide/blob/master/App.tsx).

### Custom tooltip component

You can customize the tooltip by passing a component to the `copilot` HOC maker. If you are looking for an example tooltip component, take a look at [the default tooltip implementation](https://github.com/xcarpentier/rn-tourguide/blob/master/src/components/Tooltip.js).

```js
const TooltipComponent = ({
  isFirstStep,
  isLastStep,
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
}) => (
  // ...
);

copilot({
  tooltipComponent: TooltipComponent
})(RootComponent)
```

### Custom tooltip styling

You can customize tooltips style:

```js
const style = {
  backgroundColor: '#9FA8DA',
  borderRadius: 10,
  paddingTop: 5,
}

copilot({
  tooltipStyle: style,
})(RootComponent)
```

### Custom mask color

You can customize the mask color - default is `rgba(0, 0, 0, 0.4)`, by passing a color string to the `copilot` HOC maker.

```js
copilot({
  backdropColor: 'rgba(50, 50, 100, 0.9)',
})(RootComponent)
```

### Custom labels (for i18n)

You can localize labels:

```js
copilot({
  labels: {
    previous: 'Vorheriger',
    next: 'Nächster',
    skip: 'Überspringen',
    finish: 'Beenden',
  },
})(RootComponent)
```

### Adjust vertical position

In order to adjust vertical position pass `verticalOffset` to the `copilot` HOC.

```js
copilot({
  verticalOffset: 36,
})(RootComponent)
```

### Triggering the tutorial

Use `this.props.start()` in the root component in order to trigger the tutorial. You can either invoke it with a touch event or in `componentDidMount`. Note that the component and all its descendants must be mounted before starting the tutorial since the `CopilotStep`s need to be registered first.

### Listening to the events

Along with `this.props.start()`, `copilot` HOC passes `copilotEvents` function to the component to help you with tracking of tutorial progress. It utilizes [mitt](https://github.com/developit/mitt) under the hood, you can see how full API there.

List of available events is:

- `start` — Copilot tutorial has started.
- `stop` — Copilot tutorial has ended or skipped.
- `stepChange` — Next step is triggered. Passes [`Step`](https://github.com/mohebifar/react-native-copilot/blob/master/src/types.js#L2) instance as event handler argument.

**Example:**

```js
import { copilot, CopilotStep } from '@applications-developer/rn-copilot'

const CustomComponent = ({ copilot }) => (
  <View {...copilot}>
    <Text>Hello world!</Text>
  </View>
)

class HomeScreen {
  componentDidMount() {
    this.props.copilotEvents.on('stop', () => {
      // Copilot tutorial finished!
    })
  }

  componentWillUnmount() {
    // Don't forget to disable event handlers to prevent errors
    this.props.copilotEvents.off('stop')
  }

  render() {
    // ...
  }
}
```

## Contributing

Issues and Pull Requests are always welcome.

## Hire an expert!

Looking for a ReactNative freelance expert with more than 14 years experience? Contact me from my [website](https://xaviercarpentier.com)!

## License

- [MIT](LICENSE) © 2020 Xavier CARPENTIER SAS, https://xaviercarpentier.com.
- [MIT](LICENSE) © 2017 OK GROW!, https://www.okgrow.com.
