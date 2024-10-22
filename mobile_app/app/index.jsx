import { StatusBar } from 'expo-status-bar';
import {  Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router  } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';

export default function App() {
  return (
    <SafeAreaView className= "bg-primary h=full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image 
          source={images.logo}
          className="w-[600px] h-[300px]" 
          resizeMode="contain"
          />

          

          <View>
            <Text className = "text-1xl text-gray-100 font-bold text-center">Learn Together, Grow Together with Learn Excellence</Text>
          </View>

          <CustomButton 
            title="Sign In"
            handlePress={()=>router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
          <CustomButton 
            title="Sign Up"
            handlePress={()=>router.push('teacherHome')}
            containerStyles="w-full mt-7"
          />

          </View>

        
      </ScrollView>

      <StatusBar backgroundColor='#161622' style ='light'/>

    </SafeAreaView>


  );
}

