import * as React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import {
  copilot,
  TourGuideZone,
  CopilotWrapper,
  Step,
  TourGuideZoneByPosition,
} from './src'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
  },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginVertical: 20,
  },
  middleView: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2980b9',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  row: {
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activeSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
})

interface Props {
  copilotEvents: any
  start(stepNumber?: number): void
  stop(): void
}

function App({ copilotEvents, start, stop }: Props) {
  const handleStepChange = (step: Step) =>
    console.log(`Current step is: ${step.name}`)

  React.useEffect(() => {
    copilotEvents.on('stepChange', handleStepChange)

    return () => {
      copilotEvents.off('*')
    }
  }, [])
  const iconProps = { size: 40, color: '#888' }
  return (
    <>
      <View style={styles.container}>
        <TourGuideZone
          zone={1}
          isTourGuide
          text={'A react-native-copilot remastered! 🎉'}
          borderRadius={16}
        >
          <CopilotWrapper>
            <Text style={styles.title}>
              {'Welcome to the demo of\n"rn-tourguide"'}
            </Text>
          </CopilotWrapper>
        </TourGuideZone>
        <View style={styles.middleView}>
          <TourGuideZone
            zone={3}
            isTourGuide
            shape='circle'
            text={'With animated SVG morphing with awesome flubber 🍮💯'}
          >
            <CopilotWrapper>
              <Image
                source={{
                  uri:
                    'https://pbs.twimg.com/profile_images/1223192265969016833/U8AX9Lfn_400x400.jpg',
                }}
                style={styles.profilePhoto}
              />
            </CopilotWrapper>
          </TourGuideZone>

          <TouchableOpacity style={styles.button} onPress={() => start()}>
            <Text style={styles.buttonText}>START THE TUTORIAL!</Text>
          </TouchableOpacity>

          <TourGuideZone zone={2} isTourGuide shape={'rectangle_and_keep'}>
            <CopilotWrapper>
              <TouchableOpacity style={styles.button} onPress={() => start(4)}>
                <Text style={styles.buttonText}>Step 4</Text>
              </TouchableOpacity>
            </CopilotWrapper>
          </TourGuideZone>
          <TouchableOpacity style={styles.button} onPress={() => start(2)}>
            <Text style={styles.buttonText}>Step 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => start(7)}>
            <Text style={styles.buttonText}>Step 7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={stop}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TourGuideZone zone={4} isTourGuide shape={'circle'}>
            <CopilotWrapper>
              <Ionicons name='ios-contact' {...iconProps} />
            </CopilotWrapper>
          </TourGuideZone>
          <Ionicons name='ios-chatbubbles' {...iconProps} />
          <Ionicons name='ios-globe' {...iconProps} />
          <TourGuideZone zone={5} isTourGuide>
            <CopilotWrapper>
              <Ionicons name='ios-navigate' {...iconProps} />
            </CopilotWrapper>
          </TourGuideZone>
          <TourGuideZone zone={6} isTourGuide shape={'circle'}>
            <CopilotWrapper>
              <Ionicons name='ios-rainy' {...iconProps} />
            </CopilotWrapper>
          </TourGuideZone>
        </View>
      </View>
      <TourGuideZoneByPosition
        zone={7}
        shape={'circle'}
        isTourGuide
        bottom={30}
        left={35}
        width={300}
        height={300}
      />
    </>
  )
}

export default copilot({
  animated: true,
  androidStatusBarVisible: false,
  borderRadius: 16,
})(App)
