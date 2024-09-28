import { View, Text } from 'react-native'
import React from 'react'
import { NativeScreenNavigationContainer } from 'react-native-screens'

const layout = () => {
  return (
    <>
        <NativeScreenNavigationContainer>
            <Stack.Screen
            name="CourseDashboard" component={CourseDashboard}
            />
        </NativeScreenNavigationContainer>
    </>
  )
}

export default layout