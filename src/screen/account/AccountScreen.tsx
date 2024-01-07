import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import RNFS, {getAllExternalFilesDirs, readDir} from 'react-native-fs';
const AccountScreen = () => {
  useEffect(() => {
    check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
      .then(result => {
        switch (result) {
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
              if (result === 'granted') {
                onPermissionGranted();
              } else if (result === 'denied') {
                onPermissionDenied();
              } else if (result === 'blocked') {
                onPermissionBlocked();
              }
            });
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            readExternalStorageContent();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is blocked');
            break;
        }
      })
      .catch(error => {
        console.log('check permission', error);
      });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPermissionBlocked = () => {
    console.log('The permission is denied and not requestable anymore');
  };
  const onPermissionDenied = () => {
    console.log('The permission is denied');
  };
  const onPermissionGranted = () => {
    console.log('The permission is granted');
    readExternalStorageContent();
  };

  const readExternalStorageContent = async () => {
    const allDirs = await getAllExternalFilesDirs();
    const reader = await readDir('/storage/0059-1205/Music');
    console.log(reader);

    console.log(allDirs);
  };
  return (
    <View style={{backgroundColor: 'black', flex: 1}}>
      <Text>AccountScreen</Text>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({});
