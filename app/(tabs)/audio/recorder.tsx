import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import Timer from '@/components/Timer';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Recording, Sound } from 'expo-av/build/Audio';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import Entypo from '@expo/vector-icons/Entypo';


export default function recorder() {
    const [recording,setRecording] = useState<Recording>();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [audioUri,setAudioUri] = useState('');
    const [sound, setSound] = useState<Sound>();
    const router = useRouter();
    async function startRecording() {
        try {
          if (permissionResponse?.status !== 'granted') {
            console.log('Requesting permission..');
            await requestPermission();
          }
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
          });
    
          console.log('Starting recording..');
          const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY);
          setRecording(recording);
          console.log('Recording started');
        } catch (err) {
          console.error('Failed to start recording', err);
        }
      }
    const saveAudioFile = async (uri:string) => {
        const fileName = uri.split('/').pop(); // Extract file name from URI
        const destination = `${FileSystem.documentDirectory}${fileName}`;

        try {
            await FileSystem.moveAsync({
                from: uri,
                to: destination,
            });
            return destination
        } catch (err) {
            console.error('Error saving file:', err);
        }
    };

      async function stopRecording() {
        console.log('Stopping recording..');
        await recording?.stopAndUnloadAsync();
        const uri = recording?.getURI()||"";
        setRecording(undefined);
        if (Platform.OS === "web") {
            try {
                console.log("Web")
                let blob = await fetch(uri).then((r) => r.blob());
                router.push({ pathname: '/audio/player', params: { uri:  uri } })
            } catch (error) {
                console.log(error);
            }
        } else {
                const newPath = '../../../assets/audios/audio.mp3';
                console.log(newPath)
                console.log(uri)
                const destination = await saveAudioFile(uri);
                router.push({ pathname: '/audio/player', params: { uri:  destination } })
            }
        }
        async function playSound() {
            if(!sound){
        
              console.log('Loading Sound',audioUri);
              const { sound } = await Audio.Sound.createAsync( {uri:audioUri});
              setSound(sound);
        
              console.log('Playing Sound');
              await sound.playAsync();
            }
            else{
              console.log('Pausing Sound')
              await sound.pauseAsync()
            }
          }
    return (
        <View style={{alignContent:'center',justifyContent:'center',margin:100,alignItems:'center'}}>
            { !recording ? <><TouchableOpacity onPress={startRecording} style={{alignSelf:'center'}}>
                <Image source={require('../../../assets/images/recording.png')} />
            </TouchableOpacity>
            <Text>Click on the button to start recording</Text></>
            : !audioUri ? <>
                <Image source={require('../../../assets/images/waves.png')} />
                <Timer/>
                <View style={{ backgroundColor:'purple', borderRadius:10, padding:10}}>
                    <TouchableOpacity onPress={stopRecording}>
                        <Text style = {{color:'white'}}> ◼ Done </Text>
                    </TouchableOpacity>
                </View>
            </>
            : <View style={{justifyContent:'center', alignItems:'center',paddingTop:50}}>
            <Image source={require('../../../assets/images/playerImage.png')} resizeMethod='resize' />
            <Text style={{fontWeight:'bold', fontSize:28}} >Audio Recorded</Text>
            <TouchableOpacity onPress={playSound}>
              <View style={{backgroundColor:'blue', padding:5, alignContent:'center', borderCurve:'circular'}} >
                <Entypo name="controller-play" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
            }
        </View>
    )
}