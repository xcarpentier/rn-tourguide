<h1 align="center">RN-TourGuide</h1>

<p align="center">
  A flexible <strong>tourguide</strong> for your react native app!
  <br/><small>🎉 Webable 🎉</small>
  <br/><small>(a rewriting of react-native-copilot)</small>
</p>

<p align="center">
  <img width="250" src="https://www.dropbox.com/s/9heua3qgd66125k/rn-tourguide.gif?dl=0&raw=1" alt="RN Tourguide" />
</p>
<p align="center">
    <a href="https://xcarpentier.github.io/rn-tourguide/">
      🎉DEMO WEB 🎉
    </a>
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

```tsx
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from 'rn-tourguide'

// Add <TourGuideProvider/> at the root of you app!
function App() {
  return (
    <TourGuideProvider {...{ borderRadius: 16 }}>
      <AppContent />
    </TourGuideProvider>
  )
}

const AppContent = () => {
  const iconProps = { size: 40, color: '#888' }

  // Use Hooks to control!
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController()

  // Can start at mount 🎉
  // you need to wait until everything is registered 😁
  React.useEffect(() => {
    if (canStart) {
      // 👈 test if you can start otherwise nothing will happen
      start()
    }
  }, [canStart]) // 👈 don't miss it!

  const handleOnStart = () => console.log('start')
  const handleOnStop = () => console.log('stop')
  const handleOnStepChange = () => console.log(`stepChange`)

  React.useEffect(() => {
    eventEmitter.on('start', handleOnStart)
    eventEmitter.on('stop', handleOnStop)
    eventEmitter.on('stepChange', handleOnStepChange)

    return () => {
      eventEmitter.off('start', handleOnStart)
      eventEmitter.off('stop', handleOnStop)
      eventEmitter.off('stepChange', handleOnStepChange)
    }
  }, [])

  return (
    <View style={styles.container}>
      {/*

          Use TourGuideZone only to wrap your component

      */}
      <TourGuideZone
        zone={2}
        text={'A react-native-copilot remastered! 🎉'}
        borderRadius={16}
      >
        <Text style={styles.title}>
          {'Welcome to the demo of\n"rn-tourguide"'}
        </Text>
      </TourGuideZone>
      <View style={styles.middleView}>
        <TouchableOpacity style={styles.button} onPress={() => start()}>
          <Text style={styles.buttonText}>START THE TUTORIAL!</Text>
        </TouchableOpacity>

        <TourGuideZone zone={3} shape={'rectangle_and_keep'}>
          <TouchableOpacity style={styles.button} onPress={() => start(4)}>
            <Text style={styles.buttonText}>Step 4</Text>
          </TouchableOpacity>
        </TourGuideZone>
        <TouchableOpacity style={styles.button} onPress={() => start(2)}>
          <Text style={styles.buttonText}>Step 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stop}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
        <TourGuideZone
          zone={1}
          shape='circle'
          text={'With animated SVG morphing with awesome flubber 🍮💯'}
        >
          <Image source={{ uri }} style={styles.profilePhoto} />
        </TourGuideZone>
      </View>
      <View style={styles.row}>
        <TourGuideZone zone={4} shape={'circle'}>
          <Ionicons name='ios-contact' {...iconProps} />
        </TourGuideZone>
        <Ionicons name='ios-chatbubbles' {...iconProps} />
        <Ionicons name='ios-globe' {...iconProps} />
        <TourGuideZone zone={5}>
          <Ionicons name='ios-navigate' {...iconProps} />
        </TourGuideZone>
        <TourGuideZone zone={6} shape={'circle'}>
          <Ionicons name='ios-rainy' {...iconProps} />
        </TourGuideZone>
        <TourGuideZoneByPosition
          zone={7}
          shape={'circle'}
          isTourGuide
          bottom={30}
          left={35}
          width={300}
          height={300}
        />
      </View>
    </View>
  )
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
  startAtMount?: boolean //  start at mount
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  children: React.ReactNode
}

type Shape = 'circle' | 'rectangle' | 'circle_and_keep' | 'rectangle_and_keep'

export interface TourGuideProviderProps {
  tooltipComponent?: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  labels?: Labels
  androidStatusBarVisible?: boolean
  backdropColor?: string
  verticalOffset?: number
  wrapperStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  borderRadius?: number
  animationDuration?: number
  children: React.ReactNode
  dismissOnPress: boolean
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

In order to start the tutorial, you can call the `start` function from `useTourGuideController` hook:

```js
function HomeScreen() {
  const { start } = useTourGuideController()

  React.useEffect(() => {
    start()
  }, [])


  render() {
    // ...
  }
}

export default HomeScreen
```

If you are looking for a working example, please check out [this link](https://github.com/xcarpentier/rn-tourguide/blob/master/App.tsx).

### Custom tooltip component

You can customize the tooltip by passing a component to the `copilot` HOC maker. If you are looking for an example tooltip component, take a look at [the default tooltip implementation](https://github.com/xcarpentier/rn-tourguide/blob/master/src/components/Tooltip.tsx).

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

<TourGuideProvider {...{tooltipComponent: TooltipComponent}}>
// ...
</TourGuideProvider>
```

### Custom tooltip styling

You can customize tooltips style:

```tsx
const style = {
  backgroundColor: '#9FA8DA',
  borderRadius: 10,
  paddingTop: 5,
}

<TourGuideProvider {...{ tooltipStyle: style }}>
// ...
</TourGuideProvider>
```

### Custom mask color

You can customize the mask color - default is `rgba(0, 0, 0, 0.4)`, by passing a color string to the `copilot` HOC maker.

```tsx
<TourGuideProvider {...{ backdropColor: 'rgba(50, 50, 100, 0.9)' }}>
  // ...
</TourGuideProvider>
```

### Custom labels (for i18n)

You can localize labels:

```tsx
<TourGuideProvider
  {...{
    labels: {
      previous: 'Vorheriger',
      next: 'Nächster',
      skip: 'Überspringen',
      finish: 'Beenden',
    },
  }}
>
  // ...
</TourGuideProvider>
```

### Listening to the events

Along with `start()`, `useTourGuideController` passes `copilotEvents` function to the component to help you with tracking of tutorial progress. It utilizes [mitt](https://github.com/developit/mitt) under the hood, you can see how full API there.

List of available events is:

- `start` — Copilot tutorial has started.
- `stop` — Copilot tutorial has ended or skipped.
- `stepChange` — Next step is triggered. Passes [`Step`](https://github.com/mohebifar/react-native-copilot/blob/master/src/types.js#L2) instance as event handler argument.

## Contributing

Issues and Pull Requests are always welcome.

## Hire an expert!

Looking for a ReactNative freelance expert with more than 14 years experience? Contact me from my [website](https://xaviercarpentier.com)!

## License

- [MIT](LICENSE) © 2020 Xavier CARPENTIER SAS, https://xaviercarpentier.com.
- [MIT](LICENSE) © 2017 OK GROW!, https://www.okgrow.com.
