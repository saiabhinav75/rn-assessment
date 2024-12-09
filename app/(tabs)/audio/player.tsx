import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function player() {
  const [sound, setSound] = useState<Sound>();
  const [playbackStatus, setPlaybackStatus] = useState({
    positionMillis: 0,
    durationMillis: 1,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const params: { "uri": string, "showSave": string } = useLocalSearchParams();
  const router = useRouter();
  console.log("params", params.uri)
  async function playSound() {
    if (!sound) {
      const { sound } = await Audio.Sound.createAsync({ uri: params.uri });
      setSound(sound);
      console.log(1)
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPlaybackStatus({
            positionMillis: status.positionMillis,
            durationMillis: status.durationMillis || 1, // Default to 1 if duration isn't available
          });
        }
      });
      setIsPlaying(true);
      // console.log('Playing Sound');
      await sound.playAsync();
    }
    else if (playbackStatus.positionMillis === playbackStatus.durationMillis) {
      console.log(2)
      await sound.replayAsync()
      setIsPlaying(true);
    }
    else if (!isPlaying && playbackStatus.positionMillis < playbackStatus.durationMillis) {
      // console.log("Playing Sound");
      console.log(3)
      setIsPlaying(true)
      await sound.playAsync()
    }
    else if (isPlaying) {
      // console.log("Pausing Sound")
      console.log(4)
      setIsPlaying(false)
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

  // play on end of duration
  // useEffect(()=>{
  //   return playbackStatus.positionMillis === playbackStatus.durationMillis && sound
  //  ? () => {
  //   console.log("Unloading Sound");
  //   sound.unloadAsync();
  //   setSound(undefined);
  //  }: undefined

  // },[playbackStatus])
  async function handleSave() {
    console.log("Clicked Save")
    const rootDir = `${FileSystem.documentDirectory}recordings/`
    const folderInfo = await FileSystem.getInfoAsync(rootDir);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(rootDir, { intermediates: true });
    }
    const destination = `${rootDir}${params.uri.split("/").pop()}`;
    await FileSystem.moveAsync({ from: params.uri, to: destination })

    console.log("File Saved to", destination)
    router.replace('/audio')
  }
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
      <Image source={require('../../../assets/images/playerImage.png')} resizeMethod='resize' />
      <Text style={{ fontWeight: 'bold', fontSize: 28 }} >Audio Recorded</Text>
      <TouchableOpacity onPress={playSound} style={{ padding: 5 }}>
        <View style={{ backgroundColor: '#ADD8E6', padding: 10, alignContent: 'center', borderCurve: 'circular', }} >
          <Entypo name="controller-play" size={24} color="white" />
        </View>
      </TouchableOpacity>
      {!(params.showSave === 'false') ? <TouchableOpacity style={{ padding: 20, alignContent: 'center', backgroundColor: '#ADD8E6', minWidth: '90%', justifyContent: 'center', alignItems: 'center' }} onPress={handleSave}>
        <Text style={{ fontSize: 20 }}>Save Audio</Text>
      </TouchableOpacity> : <></>}
    </View>
  )
}
