import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router';

import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View className="items-center justify-center gap-2">
            <Image 
            source={icon}
            resizeMode="contain"
            tintColor={color}
            className="w-6 h-6"
            />

            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}>
                {name}
            </Text>
            
        </View>
    )
}

const studentTabsLayout = () => {
  return (
    <>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#003366',
                tabBarInactiveTintColor: '#CDCDE0',
                tabBarStyle: {
                    borderTopWidth: 1,
                    bordertopColor: "#232533",
                    height: 84,
                }

            }}
        >
            <Tabs.Screen 
                name="home"
                options={{
                    title:'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={color}
                            name="Home"
                            focused={focused}
                        />
                    )
                }}
            />

<Tabs.Screen 
                name="course"
                options={{
                    title:'Courses',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.course}
                            color={color}
                            name="Courses"
                            focused={focused}
                        />
                    )
                }}
            />

<Tabs.Screen 
                name="lecture"
                options={{
                    title:'Lectures',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.lecture}
                            color={color}
                            name="Lectures"
                            focused={focused}
                        />
                    )
                }}
            />

<Tabs.Screen 
                name="profile"
                options={{
                    title:'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.profile}
                            color={color}
                            name="Profile"
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>
    </>
  )
}

export default studentTabsLayout