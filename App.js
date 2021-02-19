import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, StatusBar, Button} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DeviceEventEmitter} from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import Geolocation from '@react-native-community/geolocation'

// importing Service to call

const App = () => {
  // NOTIFICATION PARAMETERS : these are the parameters we have to start a foreground service , * indicate Required.
  // id, * // Id of the notification must be a int
  // title // title of the notification
  // message  // message inside of the notification
  // vibration
  // visibility  ,
  // icon // if you want to use custom icons, you can just use theme by giving their name without extension, make sure they are drawable. for eg = ic_launcher,
  // largeicon // if you want to use custom icons, you can just use theme by giving their name without extension, make sure they are drawable. for eg = ic_launcher,
  // importance // importance, you can read about it on google's official notification docs
  // number // importance, you can read about it on google's official notification docs
  // button // want a button in the notification, set it true
  // buttonText // the text of the button.
  // buttonOnPress // onPress Button, set a string here, onClick your app will reopen with that string in device emitter
  // mainOnPress  // onPress Main Notification, set a string here, onClick your app will reopen with that string in device emitter

  useEffect(() => {
    // device event emitter used to
    let subscription = DeviceEventEmitter.addListener(
      'notificationClickHandle',
      function (e) {
        console.log('json', e);
      },
    );
    return function cleanup() {
      subscription.remove();
    };
  }, []);

  const onStart = () => {
    // Checking if the task i am going to create already exist and running, which means that the foreground is also running.
    if (ReactNativeForegroundService.is_task_running('taskid')) return;
    // Creating a task.
    ReactNativeForegroundService.add_task(() => {
      console.log('I am Being Tested')
      Geolocation.getCurrentPosition((info) => {
        console.log("Component Geo info => " + info.coords.latitude + " " + info.coords.longitude);
      },error => console.log('Error', JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 60000, maximumAge: 1000},
      )
      },
      {
        delay: 1000,
        onLoop: true,
        taskId: 'taskid',
        onError: (e) => console.log(`Error logging:`, e),
      },
    );
    // starting  foreground service.
    return ReactNativeForegroundService.start({
      id: 144,
      title: 'Foreground Service',
      message: 'you are online!',
    });
  };

  const onStop = () => {
    // Make always sure to remove the task before stoping the service. and instead of re-adding the task you can always update the task.
    if (ReactNativeForegroundService.is_task_running('taskid')) {
      ReactNativeForegroundService.remove_task('taskid');
    }
    // Stoping Foreground service.
    return ReactNativeForegroundService.stop();
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>An Example for React Native Foreground Service. </Text>
        <Button title={'Start'} onPress={onStart} />
        <Button title={'Stop'} onPress={onStop} />
      </SafeAreaView>
    </>
  );
};

export default App;
