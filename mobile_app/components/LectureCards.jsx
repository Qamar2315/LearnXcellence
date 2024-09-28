import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, FlatList } from 'react-native';
import { Video } from 'expo-av';  // Importing Video from expo-av
import * as Animatable from 'react-native-animatable';

import { icons } from '../constants';
import { images } from '../constants';

const zoomIn = {
    0: {
      scale: 0.7
    },
    1: {
      scale: 1,
    }
  };
  
  const zoomOut = {
    0: {
      scale: 1
    },
    1: {
      scale: 0.7,
    }
  };
  
  const LectureItem = ({ activeItem, item }) => {
    const [play, setPlay] = useState(false);
  
    return (
      <Animatable.View
        className="mr-0"
        animation={activeItem === item.id ? zoomIn : zoomOut}
        duration={500}
      >
        {play ? (
          // Play the video once the user taps on the thumbnail
          <View className="bg-gray-200 w-auto p-4 rounded-2xl shadow-lg mb-0 border-2 border-gray-700 mr-4">
            <Video
              source={item.videoUrl}  // Using video URL from local or remote
              style={{ width: 300, height: 200 }}  // NativeWind does not apply to the Video component, so we use inline styling here
              useNativeControls  // Show native video controls (play/pause, volume, etc.)
              resizeMode="cover"  // Adjust how the video scales within the player
              isLooping  // Optional: Loop the video
            />
            <Text className="text-lg text-blue-950 mt-2">{item.title}</Text>
          </View>
        ) : (
          // Display the thumbnail until the user taps to play the video
          <TouchableOpacity
            className="relative justify-center items-center"
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground
              source={images.thumbnail}
              className="w-72 h-52 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black-100"
              resizeMode='cover'
            />
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </Animatable.View>
    );
  };

const LectureCards = ({ posts, title, creator }) => {
    const [activeItem, setActiveItem] = useState(posts[0]?.id);

    const viewabilityConfig = { itemVisiblePercentThreshold: 70 };
    const viewableItemsChanged = ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        setActiveItem(viewableItems[0].item.id);  // Use item.id instead of key
      }
    };

    const viewabilityConfigCallback = useRef(viewableItemsChanged);



    return (
        <View className="flex-col w-full bg-gray-200 p-4 shadow-lg mb-1 border-t border-b border-gray-700">
          <View className="flex-col items-start space-x-4">
            
            <Text className="text-1xl font-pbold text-black">{title}</Text>
          </View>
          <Text className="text-sm text-blue-950">Created By {creator}</Text>
          <FlatList 
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <LectureItem activeItem={activeItem} item = {item} />
            )}
            onViewableItemsChanged={viewabilityConfigCallback.current}
            viewabilityConfig={viewabilityConfig}
            contentOffset={{ x: 170 }}
            horizontal  // Scroll horizontally
            showsHorizontalScrollIndicator={false}
          />

        </View>
      );
  
}

export default LectureCards