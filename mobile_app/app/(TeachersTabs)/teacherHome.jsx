import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';  // Importing images (if needed)
import SearchInput from '../../components/SearchInput';
import Lectures from '../../components/Lectures';
import EmptyState from '../../components/EmptyState';
import CourseCards from '../../components/CourseCards';  // Importing the CourseCard component
import videos from '../../constants/videos';  // Importing videos from videos.js

const teacherHome = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Add any refresh logic here
    setRefreshing(false);
  };

  const courses = [
    { id: 1, title: 'Introduction to Database', creator: 'John Doe' },
    { id: 2, title: 'Object Oriented Programming', creator: 'Jane Smith' },
    { id: 3, title: 'Data Structures and Algorithms', creator: 'Alice Johnson' },
    { id: 4, title: 'Introduction to Database', creator: 'John Doe' },
    { id: 5, title: 'Object Oriented Programming', creator: 'Jane Smith' },
    { id: 6, title: 'Data Structures and Algorithms', creator: 'Alice Johnson' }
  ];

  const lectureVideos = [
    { id: 1, title: 'Lecture 1: Database Basics', videoUrl: videos.video1 },
    { id: 2, title: 'Lecture 2: OOP Concepts', videoUrl: videos.video2 },
    { id: 3, title: 'Lecture 3: Data Structures Overview', videoUrl: videos.video3 },
    { id: 4, title: 'Lecture 4: Algorithms Introduction', videoUrl: videos.video4 }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white border-2">
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CourseCards title={item.title} creator={item.creator} />
        )}
        ListHeaderComponent={() => (
          <View className="mt-4 px-4 space-y-6">
            <View className="flex-row justify-between mb-4">
              <View>
                <Text className="text-sm font-medium text-blue-950">Welcome Back</Text>
                <Text className="text-2xl font-semibold text-blue-950">Waqas</Text>
              </View>
              <View className="mt-1.5">
                <Image 
                  source={images.logoSmall}
                  className="w-9 h-9"
                  resizeMode='contain'
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-xl font-pbold text-blue-950 mb-3">My Courses</Text>
              <Lectures posts={lectureVideos} />
            </View>

            <View className="w-full flex-1 pt-8">
              <Text className="text-blue-950 text-xl font-pbold mt-0 mb-2">Student Courses</Text>
            </View>
          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState 
            title="No Lectures Found"
            subtitle="No lecture uploaded yet"
          />
        )}

        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
          />
        } 
      />
    </SafeAreaView>
  );
};

export default teacherHome;
