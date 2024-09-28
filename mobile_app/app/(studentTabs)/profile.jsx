import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons'; // Importing icons from FontAwesome

import { images } from '../../constants';
import FormField from '../../components/FormField'; // Adjust the import path as needed

const ProfilePage = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('********');
  const [isEditing, setIsEditing] = useState(false);

  // Function to handle editing state
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {/* Profile Photo */}
      <View className="items-center mb-6">
        <Image
          source={images.dogProfile} // Placeholder profile image
          className="w-24 h-24 rounded-full mb-4"
        />
        <Text className="text-2xl font-bold">Profile</Text>
      </View>

      {/* Editable Fields */}
      <View className="mb-6">
        {/* Name Field */}
        <View className="flex-row items-center mb-4">
          <FormField
            title="Name"
            value={name}
            placeholder="Enter your name"
            handleChangeText={(text) => {
              setName(text);
              setIsEditing(true);
            }}
            otherStyles="flex-1"
          />
          <TouchableOpacity onPress={handleEdit}>
            <FontAwesome name="pencil" size={15} className="ml-2 text-gray-500" />
          </TouchableOpacity>
        </View>

        {/* Email Field */}
        <View className="flex-row items-center mb-4">
          <FormField
            title="Email"
            value={email}
            placeholder="Enter your email"
            handleChangeText={(text) => {
              setEmail(text);
              setIsEditing(true);
            }}
            otherStyles="flex-1"
          />
          <TouchableOpacity onPress={handleEdit}>
            <FontAwesome name="pencil" size={15} className="ml-2 text-gray-500" />
          </TouchableOpacity>
        </View>

        {/* Password Field */}
        <View className="flex-row items-center mb-4">
          <FormField
            title="Password"
            value={password}
            placeholder="Enter your password"
            handleChangeText={(text) => {
              setPassword(text);
              setIsEditing(true);
            }}
            otherStyles="flex-1"
          />
          <TouchableOpacity onPress={handleEdit}>
            <FontAwesome name="pencil" size={15} className="ml-2 text-gray-500" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        className={`bg-blue-500 py-3 rounded-lg ${isEditing ? 'opacity-100' : 'opacity-50'}`}
        disabled={!isEditing}
        onPress={() => {
          setIsEditing(false);
          // Add your save logic here
        }}
      >
        <Text className="text-center text-white text-lg">Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfilePage;
