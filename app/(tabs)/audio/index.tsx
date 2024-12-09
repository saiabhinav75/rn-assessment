import {StyleSheet,Text,View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View style={{width:100}}>
      <Text>audio/index</Text>
      <Link href={'/audio/recorder'}>record</Link>
      <Link href={'/audio/player'}>player</Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
