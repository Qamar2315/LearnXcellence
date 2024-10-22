import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router';


import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'

const singUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setisSubmitting] = useState(false)

  const submit = () => {}

  return (
    <SafeAreaView className= "bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo}
            resizeMode='contain' className="w-[200px] h-[200px]"
          />

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign Up to Learn Excellence</Text>
          <FormField 
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e})}
            otherStyles="mt-7"
            keyboardType="name"
          />
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e})}
            otherStyles="mt-7"
            
          />

          <CustomButton 
            title = "Sign Up"
            handlePress = {submit}
            containerStyles="mt-7"
            isLoading = {isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2"> 

            <Text className="text-lg text-gray-100 font-pregular">Already have an account?</Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary">Sign In</Link>

          </View>

        </View>

      </ScrollView>
      
    </SafeAreaView>
  )
}

export default singUp