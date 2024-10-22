import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants'


const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-blue-950 font-pmedium ml-2">{title}</Text>

      <View className="border-1 border-gray-300 w-full h-14 bg-gray-200 rounded-2xl focus-secondary items-center flex-row">
        <TextInput 
            className="flex-1 text-blue-800 font-psemibold text-base ml-2"
            value={value}
            placehoder={placeholder}
            placeholderTextColor="#1e3a8a"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
                <Image source={!showPassword ? icons.eye: icons.hide}
                className = "w-r h-6"
                resizeMode='contain'
                />
            </TouchableOpacity>
        )}
      </View>

    </View>

  )
}

export default FormField