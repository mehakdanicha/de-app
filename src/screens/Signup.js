import { StyleSheet, Text, View, Image ,Alert} from 'react-native'
import React, { useState } from 'react'
import pic1 from '../assets/pic1.jpg'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { firebase } from '@react-native-firebase/firestore'
import firestore from '@react-native-firebase/firestore'

import uuid from 'react-native-uuid'

const Signup = () => {
  const navigation = useNavigation()
  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [address, setaddress] = useState('')
  const [phonenumber, setphonenumber] = useState('')

  const registerUser = () => {
    // Validate username
    if (!username || !/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/.test(username)) {
      alert('Please enter a valid username with both letters and digits.');
      return;
    }
    const isValidEmail = (email) => {
      // Basic email validation regex
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email);
    };
  
    const isValidPassword = (password) => {
      // Password must be at least 6 characters long
      return password.length >= 4;
    };
    // Validate email
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    // Validate password
    if (!isValidPassword(password)) {
      alert('Please enter a valid password (at least 6 characters).');
      return;
    }
  
    // Validate other fields (address and phone number)
    if (!address || !phonenumber) {
      alert('Please fill in all fields.');
      return;
    }
  
    // Proceed with registration
    const userId = uuid.v4();
    firestore()
      .collection('users')
      .doc(userId)
      .set({
        username: username,
        email: email,
        password: password,
        fulladdress: address,
        phonenumber: phonenumber,
        cart: 0,
        uid: userId,
      })
      .then((res) => {
        Alert.alert('User created');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };



  return (
    <View style={styles.container}>
      <Image source={pic1} style={styles.banner}></Image>
      <ScrollView style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.text} >Name</Text>
        <TextInput value={username} onChangeText={txt => setusername(txt)} style={styles.input}
          placeholder='Enter userName' />

        <Text style={styles.text} >Email</Text>
        <TextInput value={email} onChangeText={txt => setemail(txt)} style={styles.input}
          placeholder='Enter Email' />
        <Text style={styles.text} >Password</Text>
        <TextInput value={password} secureTextEntry onChangeText={txt => setpassword(txt)} style={styles.input}
          placeholder='Enter Password' />

        <Text style={styles.text} >Phone number</Text>
        <TextInput value={phonenumber} onChangeText={txt => setphonenumber(txt)} style={styles.input}
          placeholder='Enter phone number' />
        <Text style={styles.text} >Address</Text>
        <TextInput value={address} onChangeText={txt => setaddress(txt)} style={styles.input}
          placeholder='Enter address' />


        <TouchableOpacity style={styles.loginsignupbtn}>
          <Text style={styles.btntext}
            onPress={() => {
              registerUser()
              // navigation.navigate('Login')

            }}
          >Sign Up </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.loginsignupbtn, { backgroundColor: 'black'}]}>
          <Text style={[styles.btntext, { color: 'white' }]}
            onPress={() => {
              navigation.navigate('Login')
            }}>Login</Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  )
}

export default Signup

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  banner: {
    width: '100%',
    height: 200

  },
  card: {
    width: '96%',
    marginTop: 10,
    height: '80%',
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'white',
    elevation: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    color: 'black',
    alignSelf: 'center'
  }
  , title: {
    fontSize: 29,
    alignSelf: 'center',
    color: 'black',
    fontWeight: 600,
    marginTop: 30
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black', paddingLeft: 20, marginTop: 10,
  },
  input: {
    width: '90%',
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
    color: 'black'

  }, loginsignupbtn: {
    width: '90%',
    height: 50,
    backgroundColor: '#C58D8D',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btntext: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18

  }
})