import React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer'
import { copilot, CopilotStep } from '../index'
import { CopilotModal } from '../components/CopilotModal'

interface SampleComponentProps {
  secondStepActive?: boolean
}

const SampleComponent = ({ secondStepActive }: SampleComponentProps) => (
  <View>
    <CopilotStep
      order={0}
      name='step-1'
      text='This is the description for the first step'
    >
      <View />
    </CopilotStep>
    <CopilotStep
      order={1}
      name='step-2'
      active={secondStepActive}
      text='This is the description for the second step'
    >
      <View />
    </CopilotStep>
    <CopilotStep
      order={3}
      name='step-3'
      text='This is the description for the third step'
    >
      <View />
    </CopilotStep>
  </View>
)

SampleComponent.defaultProps = {
  secondStepActive: true,
}

it('only renders the component within a wrapper as long as tutorial has not been started', () => {
  const CopilotComponent = copilot()(SampleComponent)

  const tree = renderer.create(<CopilotComponent />)
  const modal = tree.root.findByType(CopilotModal)

  expect(modal.props.visible).toBeFalsy()
})
