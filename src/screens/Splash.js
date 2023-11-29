import { Button, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import splash from '../assets/splash.png'
import { useNavigation } from '@react-navigation/native'

const Splash = () => {
    const navigation = useNavigation()
    useEffect(() =>{
        setTimeout(() =>{
            navigation.navigate("Main")
        },2000)

    },[])

  return (
    <View style={{flex:1}}>
        <Image source={splash} style={styles.img}></Image>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
    img:{
        height: '100%',
        width: '100%'
    },
})