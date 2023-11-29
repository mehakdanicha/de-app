import { useNavigation } from '@react-navigation/native'
import { FlatList, StyleSheet, Text, View, Image, Dimensions, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useRoute } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TextInput } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid'



const Customization = ({ route }) => {
    const [height, setheight] = useState('')
    const [width, setwidth] = useState('')
    const [length, setlength] = useState('')
    const [fabric, setfabric] = useState('')
    const [material, setmaterial] = useState('')
    const [color, setcolor] = useState('')
    const [description, setdescription] = useState('')

    const [userData, setUserData] = useState(null);
    const navigation = useNavigation()
    useEffect(() => {
        getUserData();
    }, [])
    const getUserData = async () => {
        try {
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const userData = JSON.parse(storedUserData);
                setUserData(userData);
            }
        } catch (error) {
            console.error('Error fetching user data from AsyncStorage:', error);
        }
    };

    const { products } = route.params;
    const saveCustomization = async () => {
        try {
            const customizationData = {
                productName: products.producttitle,
                productPrice: products.price,
                productImage: products.productimage,
                height,
                width,
                length,
                
                material,
                color,
                description,

            };

            await firestore().collection('customizationreq').add(customizationData);

            console.log('Customization data saved successfully');
        } catch (error) {
            console.error('Error saving customization data:', error);
        }
    };
    const checkLogin = async (item) => {
        const cartId = uuid.v4();
        if (userData != null) {
            firestore().collection(`Cart-${userData.uid}`).doc(cartId)
                .set({
                    ...item, qty: 1, addedBy: userData.uid, product: products, cartId: cartId,

                    newheight: height,
                    newwidth: width,
                    newlength: length,
                    newmaterial:material,
                    newcolor: color,
                    description,
                    producttext: 'Customize product',
                    quantity: 1,
                })
                .then(res => {
                    Alert.alert('Product add to cart successfully !');
                    navigation.navigate("Main")



                }).catch(error => {
                    console.log("error");


                });

        } else {
            Alert.alert('You not login');
        }

    }
    const handleCombinedClick = () => {
        saveCustomization();
        checkLogin();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Customization Request</Text>
            </View>


            <View style={styles.productItem}>
                <Image source={{ uri: products.productimage }} style={styles.productImage}></Image>

                <View style={styles.centerView}>
                    <Text style={styles.name}>{products.producttitle}</Text>
                    <View style={styles.priceView}>
                        <Text style={styles.desc} >{"\nRS:"} {products.price}</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.card}>
                <Text style={styles.text} >Height</Text>
                <TextInput value={height} onChangeText={txt => setheight(txt)} style={styles.input} placeholder='Enter Height in inches' />

                <Text style={styles.text} >Width</Text>
                <TextInput value={width} onChangeText={txt => setwidth(txt)} style={styles.input} placeholder='Enter Width in inches' />

                <Text style={styles.text} >Length</Text>
                <TextInput value={length} onChangeText={txt => setlength(txt)} style={styles.input} placeholder='Enter Height in inches' />

    

                <Text style={styles.text} >Material</Text>
                <TextInput value={material} onChangeText={txt => setmaterial(txt)} style={styles.input} placeholder='Enter Material' />

                <Text style={styles.text} >Color</Text>
                <TextInput value={color} onChangeText={txt => setcolor(txt)} style={styles.input} placeholder='Enter Color' />

                <Text style={styles.text} >Description</Text>
                <TextInput value={description} onChangeText={txt => setdescription(txt)} style={styles.input} placeholder='Enter Description' />

                <View style={styles.btncontainer}>
                    <TouchableOpacity style={styles.cusbutton} onPress={handleCombinedClick} >
                        <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 700 }}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>





        </View>

    )
}

export default Customization

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    header: {
        width: '100%',
        height: 65,
        backgroundColor: 'white',
        elevation: 5,
        justifyContent: 'center',
        paddingLeft: 20,
    },
    title: {
        fontSize: 22,
        color: 'black',
        fontWeight: '700'
    },
    productItem: {
        width: Dimensions.get('window').width = '100%',
        height: 100,
        backgroundColor: '#E9D6D6',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 90,
        height: 80,
        borderRadius: 10,
        marginLeft: 10
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: 'black'
    },
    desc: {
        fontSize: 13,
        fontWeight: '500',
        color: 'black'
    },
    priceView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightView: {

        marginLeft: 10,
        alignItems: 'center'
    },
    centerView: {
        marginLeft: 10,
        width: '40%',

    },
    icon: {
        width: 30,
        height: 30
    },
    card: {
        width: '96%',
        marginTop: 10,
        height: '67%',
        position: 'absolute',
        bottom: 8,
        backgroundColor: 'white',
        elevation: 5,
        color: 'black',
        alignSelf: 'center'
    },
    input: {
        width: '90%',
        height: 50,
        borderWidth: 1,
        paddingLeft: 20,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center',
        color: 'black'

    },
    text: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black', paddingLeft: 20, marginTop: 10,
    },
    btncontainer: {
        alignItems: "center"
    },
    cusbutton: {
        borderWidth: 1,
        padding: 8,
        borderColor: 'black',
        borderRadius: 20,
        backgroundColor: 'black',
        color: 'white',
        width: 300,
        marginTop: 15,
        marginBottom: 5,
    },
})