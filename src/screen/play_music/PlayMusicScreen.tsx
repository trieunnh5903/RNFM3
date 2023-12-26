import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import TrackPlayer, {
  State,
  Track,
  useIsPlaying,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import styles from './style';
import {colors, icons, sizes} from '../../constant';
import {MusicCardHorizontal} from '../../components';
import {Entypo, FontAwesome, FontAwesome5, Ionicons} from '../../utils/icons';
import {BlurView} from '@react-native-community/blur';

import {useFocusEffect} from '@react-navigation/native';
import {addTracks, configPlayer} from '../../services/trackPlayer.services';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const events = [Event.PlaybackActiveTrackChanged];

function PlayMusicScreen() {
  const progress = useProgress();
  const playerState = usePlaybackState();
  const [queue, setQueue] = useState<Track[]>();
  // console.log(playerState.state);
  const insets = useSafeAreaInsets();
  const isPlaying = useIsPlaying();
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | undefined>(
    0,
  );
  const rotationValue = useSharedValue(0);
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('default');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  useEffect(() => {
    const setUpPlayer = async () => {
      console.log('setUpPlayer');
      await configPlayer();
      await initQueue();
      const queue = await TrackPlayer.getQueue();
      setQueue(queue);
    };
    setUpPlayer();
  }, []);

  const startAnimationArtWork = () => {
    rotationValue.value = withRepeat(
      withTiming(360 * 100, {duration: 10800 * 100, easing: Easing.linear}),
      -1,
    );
  };

  const stopAnimationArtWork = () => {
    cancelAnimation(rotationValue);
  };

  const artWorkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: rotationValue.value + 'deg'}],
  }));

  // player event
  async function initQueue() {
    try {
      const queue = await TrackPlayer.getQueue();
      if (queue.length <= 0) {
        await addTracks();
      }
    } catch (error) {
      await configPlayer();
      console.log('setup', error);
    }
  }

  useTrackPlayerEvents(events, async event => {
    switch (event.type) {
      case Event.PlaybackActiveTrackChanged:
        console.log('PlaybackActiveTrackChanged');
        const index = await TrackPlayer.getActiveTrackIndex();
        setActiveTrackIndex(index);
        // if (event.index && event.lastIndex) {
        //   if (event.index < event.lastIndex) {
        //     const next = await TrackPlayer.getTrack(event.index + 1);
        //     console.log('nextTrack', next);
        //   }
        // }
        break;
      default:
        break;
    }
  });

  const onChangeSlider = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  const handleTogglePlay = async () => {
    if (playerState.state === State.Playing) {
      TrackPlayer.pause();
      stopAnimationArtWork();
    } else {
      await initQueue();
      TrackPlayer.play();
      startAnimationArtWork();
    }
  };

  const onNextPress = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const onPrevPress = async () => {
    await TrackPlayer.skipToNext();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={{
          uri:
            (queue && queue[activeTrackIndex || 0]?.artwork) ??
            'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/b/f/0/1/bf0182328238f2a252496a63e51f1f74.jpg',
        }}
        style={styles.container}>
        <BlurView
          style={styles.absolute}
          blurType="dark"
          blurAmount={15}
          reducedTransparencyFallbackColor="black"
        />
        {/* header */}
        <View style={[styles.header, {marginTop: insets.top}]}>
          <View>
            <Text style={styles.headline}>
              {queue && queue[activeTrackIndex || 0]?.title}
            </Text>
            <Text style={[styles.body, {color: colors.white_75}]}>
              {queue && queue[activeTrackIndex || 0]?.artist}
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* artwork */}
        <View style={{flex: 1, alignItems: 'center'}}>
          <Animated.Image
            source={{
              uri:
                (queue && queue[activeTrackIndex || 0]?.artwork) ??
                'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/b/f/0/1/bf0182328238f2a252496a63e51f1f74.jpg',
            }}
            style={[styles.artwork, artWorkAnimatedStyle]}
          />
        </View>

        {/* next */}
        <View style={styles.nextWrapper}>
          <Text style={styles.title}>Tiếp theo</Text>
          <TouchableOpacity style={styles.addWrapper}>
            <Text style={styles.subtitle}>Thêm</Text>
            <FontAwesome name="angle-right" size={20} color={colors.white_75} />
          </TouchableOpacity>
        </View>
        <MusicCardHorizontal
          track={
            queue &&
            (queue[(activeTrackIndex || 0) - 1] ||
              queue[activeTrackIndex || queue.length - 1])
          }
          style={styles.musicCard}
        />
        {/* pre, next */}
        <View style={styles.navMusicContainer}>
          <TouchableOpacity style={{padding: 6}}>
            <FontAwesome5 name="headphones-alt" size={34} color={colors.text} />
            <Text style={[styles.textLabel]}>120k</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPrevPress} style={{padding: 6}}>
            <Ionicons name="play-skip-back" size={38} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNextPress} style={{padding: 6}}>
            <Ionicons name="play-skip-forward" size={38} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{padding: 6}}>
            <Entypo name="add-to-list" size={46} color={colors.text} />
          </TouchableOpacity>
        </View>
        {/* slider */}
        <Slider
          style={{width: '100%', marginBottom: sizes.margin}}
          minimumValue={0}
          step={1}
          maximumValue={progress.duration}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="rgba(255, 255, 255, 0.40)"
          onSlidingComplete={value => onChangeSlider(value)}
          value={progress.position}
          thumbTintColor="#FFFFFF"
        />
        {/* footer */}
        <View style={styles.footerWrapper}>
          <TouchableOpacity onPress={handleTogglePlay}>
            <Image
              source={isPlaying.playing ? icons.pause : icons.play}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

export default PlayMusicScreen;
