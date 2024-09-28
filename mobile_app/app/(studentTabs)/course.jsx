import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';
import { icons } from '../../constants';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import CourseCards from '../../components/CourseCards'; // Importing the CourseCard component

const course = () => {
  const [refreshing, setrefreshing] = useState(false);

  const onRefresh = async () => {
    setrefreshing(true);
    // Simulate refreshing or re-fetch data
    setrefreshing(false);
  };

  // Dummy data for courses
  const courses = [
    { id: 1, title: 'Introduction to Database', creator: 'John Doe' },
    { id: 2, title: 'Object Oriented Programming', creator: 'Jane Smith' },
    { id: 3, title: 'Data Structures and Algorithms', creator: 'Alice Johnson' },
    { id: 4, title: 'Introduction to Database', creator: 'John Doe' },
    { id: 5, title: 'Object Oriented Programming', creator: 'Jane Smith' },
    { id: 6, title: 'Data Structures and Algorithms', creator: 'Alice Johnson' }
  ];

  return (
    <SafeAreaView className="bg-white border-2 h-full">
      <FlatList
        data={courses}  // Use the dummy course data
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // Use the CourseCard component to render each course
          <CourseCards title={item.title} creator={item.creator} />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-blue-950">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-blue-950">
                  Waqas 
                </Text>
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

            <View className="w-full flex-1 pt-8">
              <Text className="text-2xl text-blue-950 font-pbold mt-3">
                You are currently enrolled in the following Courses
              </Text>
              {/* Course List is rendered through FlatList using CourseCard */}
            </View>
          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState 
            title="No Courses Found"
            subtitle="You are not enrolled in any course yet."
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

export default course;
