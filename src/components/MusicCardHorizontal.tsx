import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {colors, sizes} from '../constant';
import {Ionicons} from '../utils/icons';
import {Track} from 'react-native-track-player';

interface MusicCardHorizontal {
  style?: StyleProp<ViewStyle>;
  track: Track | undefined;
}
const MusicCardHorizontal = ({style, track}: MusicCardHorizontal) => {
  if (!track) {
    return;
  }
  return (
    <View style={[styles.container, style]}>
      <Image
        source={{
          uri:
            track.artwork ??
            'https://photo-resize-zmp3.zmdcdn.me/w256_r1x1_jpeg/cover/b/f/0/1/bf0182328238f2a252496a63e51f1f74.jpg',
        }}
        style={styles.image}
      />
      <View style={{gap: 2}}>
        <Text style={[styles.title]}>{track.title ?? ''}</Text>
        <Text style={styles.singer}>{track.artist ?? ''}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
          <Ionicons name="play" color={colors.text} size={14} />
          <Text style={styles.singer}>1,3k</Text>
        </View>
      </View>
    </View>
  );
};

export default MusicCardHorizontal;

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  singer: {
    color: colors.white_75,
    fontWeight: '500',
    fontSize: 12,
  },
  container: {
    alignItems: 'center',
    // backgroundColor: 'red',
    padding: sizes.padding,
    flexDirection: 'row',
    gap: sizes.base,
  },
  image: {
    width: '25%',
    aspectRatio: 1,
    borderRadius: sizes.radius,
  },
});
