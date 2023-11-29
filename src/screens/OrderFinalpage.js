
import { Dimensions, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const OrderFinalpage = ({route}) => {
  const navigation = useNavigation();
  const { orderData } = route.params;
  return (
    <View style={styles.container}>

      
      <Image source={require('../assets/greencheck.png')} style={{ width: "66%", height: "33%"}}></Image>
      <Text style={styles.text}>Thank You! {orderData.Name}</Text>
      <Text style={styles.text}>For Shopping With us..</Text>
      <Text style={styles.text}>Date:{orderData.Date}</Text>
      <Text style={styles.text}>OrderID:{orderData. OrderID}</Text>
      <View style={styles.btncontainer}>
        <TouchableOpacity style={styles.button} onPress={() => {
          navigation.navigate("Main")
        }
        }
        >
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 700 }}>
            Go back To Main
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};



export default OrderFinalpage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    width: '100%',
    height: 65,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    paddingLeft: 20,
    marginBottom:"70%",
    
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontWeight: '600'
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop:20,
    
  },
  btncontainer: {
    alignItems: "center",
    marginTop:20,
    
   
  },
  button: {
    borderWidth: 1,
    padding: 18,
    borderColor: 'pink',
    borderRadius: 20,
    backgroundColor: '#C58D8D',
    color: 'white',
    width: 300,
    marginLeft: 30,
  },
});
