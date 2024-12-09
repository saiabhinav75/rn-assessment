import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import AudioDisplay from '@/components/audioDisplay';



export default function HomeScreen() {
  const [files, setFiles] = useState<String[]>([]);
  const router = useRouter();
  const recordingsPath = `${FileSystem.documentDirectory}/recordings`
  async function readFiles() {
    const f = await FileSystem.readDirectoryAsync(recordingsPath);
    setFiles(f)
    console.log(f);
  }
  useEffect(() => {

    readFiles();
    return () => {

    }
  }, [])

  return (
    <SafeAreaView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: '5%' }}>
        <Text style={{ fontSize: 24 }}>Audio Library</Text>
        <TouchableOpacity onPress={() => router.push({pathname:'/audio/recorder'})}>
          <View style={{ borderRadius: 44 / 2, width: 44, height: 44, backgroundColor: '#ADD8E6', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, textAlign: 'center' }}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ justifyContent: 'space-between', alignContent: 'space-between' }} >
        {
          files && files.map((name, index) => (
            <View style={{ padding: '3%' }} key={index}>
              <AudioDisplay name={String(name)} />
            </View>
          ))
        }
      </View>
    </SafeAreaView>
  );
}
