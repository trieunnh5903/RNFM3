import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabNavigatorParamList} from '../types/navigation.type';
import {AccountScreen, DiscoveryScreen, PlayMusicScreen} from '../screen';

const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="PlayMusic"
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Discovery" component={DiscoveryScreen} />
      <Tab.Screen
        name="PlayMusic"
        component={PlayMusicScreen}
        options={{
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
