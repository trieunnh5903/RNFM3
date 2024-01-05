import {StyleSheet} from 'react-native';
import {colors, sizes} from '../../constant';

const styles = StyleSheet.create({
  tooltipText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
  },

  tooltipContainer: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  navMusicContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  footerWrapper: {padding: 16, alignItems: 'center'},
  container: {
    width: sizes.screen_width,
    height: sizes.screen_height,
    justifyContent: 'center',
    backgroundColor: '#112',
    flex: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  textLabel: {
    color: colors.text,
    position: 'absolute',
    right: -14,
    fontSize: 12,
    fontWeight: '500',
  },
  addWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: sizes.base,
  },
  musicCard: {
    margin: sizes.margin,
    marginTop: 0,
    backgroundColor: colors.white_15,
    borderRadius: sizes.radius,
  },
  nextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: sizes.margin,
    marginVertical: sizes.base,
  },
  headline: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 20,
  },

  artWorkWrapper: {
    width: sizes.screen_width,
    height: 'auto',
    padding: 16,
    paddingTop: 0,
  },

  artwork: {
    height: '100%',
    width: '100%',
    borderRadius: 6,
  },

  title: {
    color: colors.text,
    fontWeight: '500',
    fontSize: 16,
  },
  subtitle: {
    fontWeight: '500',
    color: colors.white_75,
    fontSize: 14,
  },
  body: {
    color: colors.text,
    fontWeight: '400',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: sizes.margin,
    alignItems: 'center',
  },
});

export default styles;
