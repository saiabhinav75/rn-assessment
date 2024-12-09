import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system'
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { ScrollView } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { FileInfo } from 'expo-file-system';

export default function AudioDisplay(props: { name: string }) {
    const [fProps, setFProps] = useState();
    const [size, setSize] = useState(0.0)
    const router = useRouter();
    const recordingsPath = `${FileSystem.documentDirectory}/recordings/`
    console.log(`${recordingsPath}${props.name}`)
    const [playbackStatus, setPlaybackStatus] = useState({
        positionMillis: 0,
        durationMillis: 1,
    });
    async function getFileProps() {
        // const file = await FileSystem.readAsStringAsync(`${recordingsPath}${props.name}`);
        console.log("File")
        const fileInfo = await FileSystem.getInfoAsync(`${recordingsPath}${props.name}`, { size: true }) as FileInfo;
        if (fileInfo.exists) {
            setSize(fileInfo.size)
        }
    }
    async function getAudioProps() {
        const { sound } = await Audio.Sound.createAsync({ uri: `${recordingsPath}${props.name}` });
        console.log("Audio");
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded) {
                setPlaybackStatus({
                    positionMillis: status.positionMillis,
                    durationMillis: status.durationMillis || 1, // Default to 1 if duration isn't available
                });
            }
        });
    }
    useEffect(() => {
        getAudioProps();
        getFileProps();
        return () => {

        }
    }, [])

    return (
        <View>
            <View style={{ flexDirection: 'row', borderColor: 'black', minWidth: '75%', justifyContent: 'space-between' }}>
                <Image source={require('../assets/images/speaker.png')} style={{ width: 40, height: 40 }} />
                <View style={{ flexDirection: 'column' }} >
                    <Text>{props.name}</Text>
                    <Text>{Number(size / 1048576).toFixed(2)} mb - {Number(playbackStatus.durationMillis / 1000).toFixed(2)} seconds</Text>
                </View>
                <TouchableOpacity onPress={() => { router.push({ pathname: '/audio/player', params: { uri: `${recordingsPath}${props.name}`, showSave: 'false' } }) }}>
                    <Entypo name="controller-play" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}
/*
      <Text>{Number(size/1048576).toFixed(2)} mb</Text>
      <Text>{Number(playbackStatus.durationMillis/1000).toFixed(2)} seconds</Text>
*/