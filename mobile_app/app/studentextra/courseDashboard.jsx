import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Icons for tabs
import { Video } from 'expo-av'; // Import Video from expo-av
import { useNavigation } from '@react-navigation/native';

import { images } from '../../constants'; // Import icons if needed
import video1 from '../../assets/videos/video2.mp4'; // Import local videos
import video2 from '../../assets/videos/video3.mp4'; // Import local videos
import videos from '../../constants/videos';

const CourseDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Lectures'); // Default tab

  // Dummy data for course details
  const courseTitle = 'Introduction to React Native';
  const instructorName = 'John Doe';

  // Sample data for tabs
  const lectures = [
    { id: 1, title: 'Lecture 1: Introduction', videoUrl: video2 },
    { id: 2, title: 'Lecture 2: Advanced Topics', videoUrl: video2 },
  ];
  const quizzes = [
    { id: 1, title: 'Quiz 1: Basics' },
    { id: 2, title: 'Quiz 2: Advanced Concepts' },
  ];
  const announcements = [
    { id: 1, title: 'Course Starts on Monday' },
    { id: 2, title: 'Exam Schedule Released' },
  ];
  const markSummary = [
    { id: 1, title: 'Assignment 1: 85%' },
    { id: 2, title: 'Quiz 1: 90%' },
  ];

  // Render content based on the active tab
  const renderContent = () => {
    if (activeTab === 'Lectures') {
      return (
        <FlatList
          data={lectures}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-4">
              <Text className="text-lg mb-2">{item.title}</Text>
              <Video
                source={item.videoUrl} // Use imported video as source
                className="w-full h-56"
                useNativeControls
                resizeMode="contain"
                isLooping
                onError={(error) => console.error('Video loading error:', error)} // Error handling
              />
            </View>
          )}
        />
      );
    }

    let data;
    switch (activeTab) {
      case 'Quizzes':
        data = quizzes;
        break;
      case 'Announcements':
        data = announcements;
        break;
      case 'Mark Summary':
        data = markSummary;
        break;
      default:
        data = [];
    }
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text className="text-lg p-2">{item.title}</Text>}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Section */}
      <View className="relative">
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-4 left-4 z-10">
          <FontAwesome5 name="arrow-left" size={24} className="text-white" />
        </TouchableOpacity>
        {/* Course Banner */}
        <Image
          source={images.background} // Placeholder image
          className="w-full h-48"
          resizeMode="cover"
        />
        {/* Course Title */}
        <View className="absolute bottom-4 left-4">
          <Text className="text-white text-sm">Course</Text>
          <Text className="text-white text-2xl font-bold">{courseTitle}</Text>
        </View>
      </View>

      {/* Student Profiles Section */}
      <View className="flex-row items-center space-x-2 mt-4 px-4">
        <Image source={images.dogProfile} className="w-10 h-10 rounded-full" />
        <Image source={images.thumbnail} className="w-10 h-10 rounded-full -ml-4" />
        <Image source={images.profile} className="w-10 h-10 rounded-full -ml-4" />
        <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center -ml-4">
          <Text className="text-black">+3</Text>
        </TouchableOpacity>
      </View>

      {/* Course Introduction */}
      <View className="px-4 mt-4">
        <Text className="text-gray-700 text-base">This course provides an in-depth introduction to React Native development...</Text>
      </View>

      {/* Tab Row */}
      <View className="flex-row justify-between mt-4 px-4 border-b border-gray-200">
        {['Lectures', 'Quizzes', 'Announcements', 'Mark Summary'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`pb-2 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-lg ${activeTab === tab ? 'text-blue-500' : 'text-gray-700'}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Area */}
      <View className="flex-1 px-4 mt-4">
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default CourseDashboard;
