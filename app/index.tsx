
import { View, Text, Image, Pressable, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomePage() {
  return (
    <SafeAreaView>
        <View style={{justifyContent:'center', alignItems:'center',paddingTop:200}}>
            <Image source={require('../assets/images/homePage.png')}/>
            <Link href={'/audio'}><Image source = {require('../assets/images/arrow.png')} /></Link>
        </View>
    </SafeAreaView>
  )
}

