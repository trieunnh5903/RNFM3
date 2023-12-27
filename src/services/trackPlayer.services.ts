import {BackHandler} from 'react-native';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  RepeatMode,
} from 'react-native-track-player';

export async function configPlayer() {
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    }).then(() => {
      TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
          alwaysPauseOnInterruption: true,
          stopForegroundGracePeriod: 0,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToPrevious,
          Capability.SkipToNext,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToPrevious,
          Capability.SkipToNext,
          Capability.Stop,
        ],
        stopIcon: require('../assets/icons/close_FILL0_wght400_GRAD0_opsz40.png'),
      });
    });
  } catch (e) {
    console.log('setupPlayer', e);
  }
}

export async function addTracks() {
  await TrackPlayer.add([
    {
      id: 'Anh Đã Quen Với Cô Đơn',
      url: require('../assets/audio/AnhDaQuenVoiCoDon-SoobinHoangSon-4821170.mp3'),
      title: 'Anh Đã Quen Với Cô Đơn',
      artist: 'Soobin Hoàng Sơn',
      duration: 4 * 60 + 28,
      artwork:
        'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/covers/a/b/ab44498b5b432879428719390baf1180_1490064587.jpg',
    },
    {
      id: 'Anh Là Ai',
      url: require('../assets/audio/Anh-La-Ai-Phuong-Ly.mp3'),
      title: 'Anh Là Ai',
      artist: 'Phương Ly',
      duration: 4 * 60 + 17,
      artwork:
        'https://photo-resize-zmp3.zmdcdn.me/w600_r300x169_jpeg/thumb_video/1/0/8/9/1089716e93a958a8aade92de364f415a.jpg',
    },
    {
      id: 'One Summer Day',
      url: require('../assets/audio/joe_hisaishi_one_summer_s_day_1387411.mp3'),
      title: 'One Summer Day',
      artist: 'Joe Hisashi',
      duration: 4 * 60 + 5,
      // artwork:
      //   'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/b/f/0/1/bf0182328238f2a252496a63e51f1f74.jpg',
    },
    {
      id: 'Mascara',
      url: require('../assets/audio/Mascara-Chillies.mp3'),
      title: 'Mascara',
      artist: 'Chillies',
      duration: 4 * 60 + 55,
      artwork:
        'https://avatar-ex-swe.nixcdn.com/song/2019/12/25/6/3/c/6/1577268566289_640.jpg',
    },
  ]);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());

  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());

  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext(),
  );

  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  );

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.reset();
    BackHandler.exitApp();
  });
}
