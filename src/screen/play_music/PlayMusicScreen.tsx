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
  Event,
  RepeatMode,
  State,
  Track,
  useIsPlaying,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import styles from './style';
import {colors, icons, sizes} from '../../constant';
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '../../utils/icons';
import {BlurView} from '@react-native-community/blur';

import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {addTracks, configPlayer} from '../../services/trackPlayer.services';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {PlayMusicScreenProps} from '../../types/navigation';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import {Modal, Portal} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {useAppDispatch, useAppSelector} from '../../utils/hooks';
import {turnOffPlayMusicTooltip} from '../../redux/slice/tooltip.slice';
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['ReactImageView: Image source "null" doesn\'t exist']);
function PlayMusicScreen({navigation}: PlayMusicScreenProps) {
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();
  const progress = useProgress();
  const playerState = usePlaybackState();
  const [queue, setQueue] = useState<Track[]>();
  const insets = useSafeAreaInsets();
  const isPlaying = useIsPlaying();
  const [activeTrackIndex, setActiveTrackIndex] = useState<number>(0);
  const artWorkRef = useRef<FlatList>(null);
  const playMusicTooltip = useAppSelector(state => state.playMusicTooltip);
  const dispatch = useAppDispatch();
  const swipeOffset = useSharedValue(6);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Queue);
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('default');
      Platform.OS === 'android' && StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
    }, []),
  );
  useEffect(() => {
    // player
    const preparePlayer = async () => {
      console.log('preparePlayer');
      await configPlayer();
      await initQueue();
      await TrackPlayer.getQueue().then(value => setQueue(value));
      synchronizeUI();
    };

    if (AppState.currentState === 'active') {
      preparePlayer();
    }
    const synchronizeUI = async () => {
      let index = await TrackPlayer.getActiveTrackIndex();
      const repeat = await TrackPlayer.getRepeatMode();
      setRepeatMode(repeat);
      console.log('synchronizeUI');
      if (index !== undefined) {
        setActiveTrackIndex(index);
        if (queue && queue?.length > 0) {
          artWorkRef.current?.scrollToIndex({index, animated: false});
        }
        // artWorkRef.current?.scrollToIndex({index, animated: false});
      }
    };

    // tooltip
    swipeOffset.value = withRepeat(
      withTiming(-swipeOffset.value, {duration: 600}),
      -1,
      true,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // bottom tab
    const unsubscribe = navigation.addListener('tabPress', async e => {
      if (isFocused) {
        e.preventDefault();
        await handleTogglePlay();
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, isPlaying]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: swipeOffset.value}],
  }));

  const handleTooltipPress = () => {
    dispatch(turnOffPlayMusicTooltip());
  };

  const handleChangeRepeatMode = async () => {
    switch (repeatMode) {
      case RepeatMode.Off:
        await TrackPlayer.setRepeatMode(RepeatMode.Track);
        setRepeatMode(RepeatMode.Track);
        break;
      case RepeatMode.Track:
        await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        setRepeatMode(RepeatMode.Queue);
        break;
      default:
        await TrackPlayer.setRepeatMode(RepeatMode.Off);
        setRepeatMode(RepeatMode.Off);
        break;
    }
  };

  // player event
  useTrackPlayerEvents(
    [
      Event.PlaybackActiveTrackChanged,
      Event.MetadataCommonReceived,
      Event.MetadataTimedReceived,
    ],
    event => {
      switch (event.type) {
        case Event.PlaybackActiveTrackChanged:
          console.log('PlaybackActiveTrackChanged');
          const index = event.index;
          if (index !== undefined && index !== activeTrackIndex) {
            if (queue && queue?.length > 0) {
              artWorkRef.current?.scrollToIndex({index, animated: false});
            }
            setActiveTrackIndex(index);
          }
          break;

        case Event.MetadataCommonReceived:
          console.log('MetadataCommonReceived', event.metadata);
          break;
        case Event.MetadataTimedReceived:
          console.log('MetadataTimedReceived', event.metadata);
          break;
        default:
          break;
      }
    },
  );

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

  const onChangeSlider = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  const handleTogglePlay = async () => {
    if (playerState.state === State.Playing) {
      TrackPlayer.pause();
    } else {
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
    async ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length === 0) {
        return;
      }
      const index = viewableItems[0].index;
      const activeTrackIndex = await TrackPlayer.getActiveTrackIndex();
      if (index !== null && index !== activeTrackIndex) {
        TrackPlayer.skip(index);
      }
    },
  ).current;

  return (
    <SafeAreaView style={{flex: 1}}>
      <Portal>
        <Modal
          visible={playMusicTooltip}
          contentContainerStyle={{
            flex: 1,
          }}>
          <TouchableOpacity
            onPress={handleTooltipPress}
            style={styles.tooltipContainer}>
            <Animated.Image
              resizeMode="contain"
              style={[{width: 150, height: 150}, animatedStyles]}
              source={icons.swipe}
              tintColor={'white'}
            />
            <Text style={styles.tooltipText}>Vuốt để chuyển bài</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
      {queue && (
        <ImageBackground
          source={{
            uri: queue && queue[activeTrackIndex]?.artwork,
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
                {queue && queue[activeTrackIndex]?.title}
              </Text>
              <Text style={[styles.body, {color: colors.white_75}]}>
                {queue && queue[activeTrackIndex]?.artist}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="search" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* artwork */}
          <FlatList
            getItemLayout={(data, index) => ({
              length: sizes.screen_width,
              offset: sizes.screen_width * index,
              index,
            })}
            ref={artWorkRef}
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
            <TouchableOpacity
              onPress={handleChangeRepeatMode}
              style={{padding: 6}}>
              <MaterialCommunityIcons
                name={
                  repeatMode === RepeatMode.Off
                    ? 'repeat-off'
                    : repeatMode === RepeatMode.Track
                    ? 'repeat-once'
                    : 'repeat'
                }
                size={38}
                color={colors.text}
              />
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
      )}
    </SafeAreaView>
  );
}

export default PlayMusicScreen;
