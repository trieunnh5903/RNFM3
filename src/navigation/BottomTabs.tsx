import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {AccountScreen, DiscoveryScreen, PlayMusicScreen} from '../screen';
import {Image, StyleSheet, Text, View} from 'react-native';
import HomeSlected from '../assets/svg/ic_home_selected.svg';
import HomeNonSlected from '../assets/svg/ic_home_non_selected.svg';
import UserNonSlected from '../assets/svg/ic_user_non_selected.svg';
import UserSlected from '../assets/svg/ic_user_selected.svg';
import Play from '../assets/svg/ic_play.svg';
import Pause from '../assets/svg/ic_pause.svg';

import {
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from 'react-native-track-player';
import {colors} from '../constant';
import {Feather} from '../utils/icons';
import {BottomTabNavigatorParamList} from '../types/navigation';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
const Tab = createBottomTabNavigator<BottomTabNavigatorParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="PlayMusic"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          position: 'absolute',
          left: 0,
          bottom: 0,
          elevation: 0,
          borderTopWidth: 0,
          backgroundColor: 'black',
        },
      }}>
      <Tab.Screen
        name="Discovery"
        component={DiscoveryScreen}
        options={{
          tabBarIcon({focused}) {
            return <DiscoveryIcon focused={focused} />;
          },
        }}
      />
      <Tab.Screen
        name="PlayMusic"
        component={PlayMusicScreen}
        options={{
          tabBarStyle: {
            height: 70,
            position: 'absolute',
            left: 0,
            bottom: 0,
            elevation: 0,
            borderTopWidth: 0,
            backgroundColor: 'transparent',
          },
          tabBarIcon({focused}) {
            return <PlayMusicIcon focused={focused} />;
          },
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon({focused}) {
            return <AccountIcon focused={focused} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const DiscoveryIcon = ({focused}: {focused: boolean}) => {
  return (
    <View style={{alignItems: 'center'}}>
      {focused ? <HomeSlected /> : <HomeNonSlected />}
      <Text
        style={{
          color: focused ? '#15CEFD' : '#A8A8A8',
          fontSize: 12,
        }}>
        Khám phá
      </Text>
    </View>
  );
};

const PlayMusicIcon = ({focused}: {focused: boolean}) => {
  const track = useActiveTrack();
  const {playing} = useIsPlaying();
  const {duration, position} = useProgress();
  const fill = (position / duration) * 100;
  return (
    <View style={{alignItems: 'center'}}>
      {!focused ? (
        <AnimatedCircularProgress
          rotation={0}
          size={56}
          width={3}
          fill={fill || 0}
          tintColor="#00e0ff"
          backgroundColor="#3d5875">
          {() =>
            track?.artwork ? (
              <Image
                source={{
                  uri: track.artwork,
                }}
                style={styles.artWork}
              />
            ) : (
              <View style={styles.emptyArtwork}>
                <Feather name="music" color={colors.text} size={24} />
              </View>
            )
          }
        </AnimatedCircularProgress>
      ) : playing ? (
        <Pause />
      ) : (
        <Play />
      )}
    </View>
  );
};

const AccountIcon = ({focused}: {focused: boolean}) => {
  return (
    <View style={{alignItems: 'center'}}>
      {focused ? <UserSlected /> : <UserNonSlected />}
      <Text
        style={{
          color: focused ? '#15CEFD' : '#A8A8A8',
          fontSize: 12,
        }}>
        Khám phá
      </Text>
    </View>
  );
};

export default BottomTabs;
const styles = StyleSheet.create({
  artWork: {width: 50, height: 50, borderRadius: 100},
  emptyArtwork: {
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
    backgroundColor: 'rgba(256,256,256,0.2)',
    alignItems: 'center',
  },
});
