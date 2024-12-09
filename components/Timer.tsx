import { View, Text } from 'react-native'
import { useEffect, useState } from 'react';
import React from 'react'

export default function Timer() {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1); // Use the functional form to ensure the correct state
          }, 1000);
      
          // Cleanup interval on component unmount
          return () => clearInterval(interval);
    }, [])
    

    console.log(seconds)
  return (
    <View>
      <Text style={{fontSize:28}}>{ Math.floor(seconds/60).toString() + ':' + Math.floor(seconds%60).toString()}</Text>
    </View>
  )
}