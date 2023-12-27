import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

export type BottomTabNavigatorParamList = {
  Discovery: undefined;
  PlayMusic: undefined;
  Account: undefined;
};

type PlayMusicScreenProps = BottomTabScreenProps<
  BottomTabNavigatorParamList,
  'PlayMusic'
>;
