import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabNavigatorParamList} from '../types/navigation.type';
import {AccountScreen, DiscoveryScreen, PlayMusicScreen} from '../screen';
import {Image, Text, View} from 'react-native';
import {icons} from '../constant';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="PlayMusic"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderColor: 'black',
          height: 70,
        },
      }}>
      <Tab.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{
          tabBarIcon({focused}) {
            return (
              <View style={{alignItems: 'center'}}>
                <Image
                  style={{width: 32, height: 32}}
                  source={
                    focused
                      ? icons.headphone_non_selected
                      : icons.headphone_selected
                  }
                />
                <Text
                  style={{
                    color: focused ? '#15CEFD' : '#A8A8A8',
                    fontSize: 12,
                  }}>
                  Khám phá
                </Text>
              </View>
            );
          },
        }}
      />
      <Tab.Screen name="PlayMusic" component={PlayMusicScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
