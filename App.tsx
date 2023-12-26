import React, {useEffect} from 'react';
import BottomTabs from './src/navigation/BottomTabs';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
