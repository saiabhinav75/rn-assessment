import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import Entypo from '@expo/vector-icons/Entypo';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function player() {
  const [sound, setSound] = useState<Sound>();
  const params:{"uri":string} = useLocalSearchParams();
  console.log("params",params.uri)

  const checkFileExists = async (uri:string) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    console.log(fileInfo);
    if (!fileInfo.exists) {
      console.error('File does not exist at the provided URI:', uri);
    } else {
      console.log('File exists and is ready for playback:', uri);
    }
  };
  checkFileExists(params.uri);

  async function playSound() {
    const Sound = new Audio.Sound();
    if(!sound){

      console.log('Loading Sound',params.uri);
      const { sound } = await Audio.Sound.createAsync( {uri:params.uri});
      setSound(sound);

      console.log('Playing Sound');
      await sound.playAsync();
    }
    else{
      console.log('Pausing Sound')
      await sound.pauseAsync()
    }
  }
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  return (
    <View style={{justifyContent:'center', alignItems:'center',paddingTop:50}}>
      <Image source={require('../../../assets/images/playerImage.png')} resizeMethod='resize' />
      <Text style={{fontWeight:'bold', fontSize:28}} >Audio Recorded</Text>
      <TouchableOpacity onPress={playSound}>
        <View style={{backgroundColor:'blue', padding:5, alignContent:'center', borderCurve:'circular'}} >
          <Entypo name="controller-play" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  )
}