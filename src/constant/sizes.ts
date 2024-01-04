import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('screen');
const sizes = {
  screen_width: width,
  screen_height: height,
  radius: 10,
  margin: 16,
  base: 6,
  padding: 10,
};

export default sizes;
