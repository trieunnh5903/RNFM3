import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  StatusBar,
  Platform,
  SafeAreaView,
  AppState,
  FlatList,
  ViewToken,
} from 'react-native';
import TrackPlayer, {
  State,
  Track,
  useIsPlaying,
  usePlaybackState,
  useProgress,
  Event,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import styles from './style';
import {colors, sizes} from '../../constant';
import {Entypo, FontAwesome5, Ionicons} from '../../utils/icons';
import {BlurView} from '@react-native-community/blur';

import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {addTracks, configPlayer} from '../../services/trackPlayer.services';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Easing,
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {PlayMusicScreenProps} from '../../types/navigation';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {Freeze} from 'react-freeze';
import {Image} from 'react-native';

function PlayMusicScreen({navigation}: PlayMusicScreenProps) {
  const appState = useRef(AppState.isAvailable);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();
  const progress = useProgress();
  const playerState = usePlaybackState();
  const [queue, setQueue] = useState<Track[]>();
  // console.log(playerState.state);
  const insets = useSafeAreaInsets();
  const isPlaying = useIsPlaying();
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const rotationValue = useSharedValue(0);
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('default');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );

  useEffect(() => {
    const preparePlayer = async () => {
      console.log('preparePlayer');
      await configPlayer();
      await initQueue();
      await TrackPlayer.getQueue().then(value => setQueue(value));
    };

    if (appState.current) {
      preparePlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.current]);

  useEffect(() => {
    if (isPlaying.playing) {
      startAnimationArtWork();
    } else {
      stopAnimationArtWork();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', async e => {
      if (isFocused) {
        e.preventDefault();
        await handleTogglePlay();
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, isPlaying]);

  const startAnimationArtWork = () => {
    rotationValue.value = withRepeat(
      withTiming(360 * 100, {duration: 10800 * 100, easing: Easing.linear}),
      -1,
    );
  };

  const stopAnimationArtWork = () => {
    cancelAnimation(rotationValue);
  };

  // player event
  async function initQueue() {
    try {
      const queue = await TrackPlayer.getQueue();
      if (queue.length <= 0) {
        await addTracks();
      }
    } catch (error) {
      await configPlayer();
      console.log('initQueue', error);
    }
  }

  // useTrackPlayerEvents(events, async event => {
  //   switch (event.type) {
  //     case Event.PlaybackActiveTrackChanged:
  //       console.log('PlaybackActiveTrackChanged');
  //       const index = await TrackPlayer.getActiveTrackIndex();
  //       if (index) {
  //         setActiveTrackIndex(index);
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // });

  // console.log(activeTrackIndex);

  const onChangeSlider = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  const handleTogglePlay = async () => {
    if (playerState.state === State.Playing) {
      TrackPlayer.pause();
    } else {
      await initQueue();
      TrackPlayer.play();
    }
  };

  const onNextPress = async () => {
    await TrackPlayer.skipToNext();
  };

  const onPrevPress = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const handleViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]; changed: ViewToken[]}) => {
      if (viewableItems.length === 0) {
        return;
      }
      const index = viewableItems[0].index;
      console.log(index);

      if (index !== null) {
        setActiveTrackIndex(index);
        TrackPlayer.skip(index);
      }
    },
  ).current;

  return (
    <SafeAreaView style={{flex: 1}}>
      <Freeze freeze={!queue}>
        <ImageBackground
          source={{
            uri:
              (queue && queue[activeTrackIndex || 0]?.artwork) ??
              'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/b/f/0/1/bf0182328238f2a252496a63e51f1f74.jpg',
          }}
          style={[styles.container, {paddingBottom: tabBarHeight}]}>
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
          <FlatList
            data={queue}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{
              waitForInteraction: true,
              viewAreaCoveragePercentThreshold: 95,
            }}
            keyExtractor={i => i.url + i.title}
            renderItem={({item}) => {
              return (
                <View style={styles.artWorkWrapper}>
                  <Image
                    source={{
                      uri:
                        item.artwork ??
                        'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/b/f/0/1/bf0182328238f2a252496a63e51f1f74.jpg',
                    }}
                    style={[styles.artwork]}
                  />
                </View>
              );
            }}
          />

          {/* pre, next */}
          <View style={styles.navMusicContainer}>
            <TouchableOpacity style={{padding: 6}}>
              <FontAwesome5
                name="headphones-alt"
                size={34}
                color={colors.text}
              />
              <Text style={[styles.textLabel]}>120k</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onPrevPress} style={{padding: 6}}>
              <Ionicons name="play-skip-back" size={38} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onNextPress} style={{padding: 6}}>
              <Ionicons
                name="play-skip-forward"
                size={38}
                color={colors.text}
              />
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
        </ImageBackground>
      </Freeze>
    </SafeAreaView>
  );
}

export default PlayMusicScreen;
