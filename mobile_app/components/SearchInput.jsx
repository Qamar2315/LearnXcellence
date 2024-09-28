import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'

import { icons } from '../constants'


const SearchInput = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
    const [showPassword, setshowPassword] = useState(false)
  return (
    
      <View className="border-2 border-gray-200 w-full h-16 bg-gray-400 rounded-2xl focus-secondary items-center flex-row space-x-4">
        <TextInput 
            className="text-base mt-0.5 text-white flex-1 font-pregular"
            value={value}
            placeholder="   Search for a Course"
            placeholderTextColor="#FFFFFF"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />

        <TouchableOpacity>
          <Image 
           source={icons.search}
           className="w-5 h-5"
           resizeMode="contain"
          />
        </TouchableOpacity>
      </View>


  )
}

export default SearchInput