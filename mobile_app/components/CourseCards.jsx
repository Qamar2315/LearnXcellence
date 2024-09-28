import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';


import { icons } from '../constants';


const CourseCards = ({ title, creator }) => {
  return (
    <View className="flex-col w-96 bg-gray-200 p-4 rounded-3xl shadow-lg mb-5 border-2 border-gray-700 ml-3">
      <View className="flex-col items-start space-x-4">
        <View className="flex-row flex-wrap p-4">
        <Image 
          source={icons.course1}
          className="w-10 h-10"
          resizeMode="contain"
        />
        </View>
        <Link href="/studentextra/courseDashboard" className="text-1xl font-pbold text-black">{title}</Link>
      </View>
      <Text className="text-sm text-blue-950">     Created By {creator}</Text>
      <Link href="/studentextra/courseDashboard" className="text-sm text-blue-950">     {creator}</Link>
    </View>
  );
};

export default CourseCards;
