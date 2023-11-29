import { Dimensions, FlatList, StyleSheet, Text, View, Image,Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const OrderSummary = ({route}) => {
    const [cartList, setCartList] = useState([]);
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const { orderData } = route.params;
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        // Fetch user data from AsyncStorage when the component mounts
        getUserData();
    }, []);

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
    // Fetch data from Firestore
    useEffect(() => {
        if (userData) {
            const cartRef = firestore().collection(`Cart-${userData.uid}`);

            const unsubscribe = cartRef.onSnapshot((snapshot) => {
                const items = [];
                let itemsCount = 0;
                let itemsPrice = 0;

                snapshot.forEach((doc) => {
                    const itemData = doc.data();
                    const item = { id: doc.id, ...itemData };
                    itemsCount += item.qty;
                    itemsPrice += item.qty * item.product.price;
                    items.push(item);
                });

                setTotalItems(itemsCount);
                setTotalPrice(itemsPrice);
                setCartItems(items);
            });

            return () => unsubscribe();
        }
    }, [userData]);

    
    const saveorder = async () => {
        try {
          // Check if an order already exists for the user
          const orderRef = firestore().collection('Orders').where('username', '==', userData.username);
          const snapshot = await orderRef.get();
      
          if (!snapshot.empty) {
            // If an order exists, update it
            const existingOrderDoc = snapshot.docs[0]; // Assuming there's only one order per user
            await existingOrderDoc.ref.update(orderData);
            Alert.alert('Order data updated successfully');
          } else {
            // If no order exists, create a new one
            await firestore().collection('Orders').add(orderData);
            Alert.alert('Order data saved successfully');
          }
      
          // Delete the user's cart after successfully saving or updating order data
          const cartRef = firestore().collection(`Cart-${userData.uid}`);
          const cartSnapshot = await cartRef.get();
      
          if (!cartSnapshot.empty) {
            cartSnapshot.docs.forEach((doc) => {
              doc.ref.delete();
            });
          }
        } catch (error) {
          console.error('Error saving or updating order data:', error);
        }
      };
      
      const handleCombinedClick = () => {
        saveorder();
        navigation.navigate('orderfinal',{orderData});
      };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Order Summary</Text>
            <Text style={styles.text1}>Added Product</Text>

           
                <View >
                <Text style={styles.text1}>Order ID #{orderData.OrderID} </Text>
                    <FlatList
                        data={cartItems} keyExtractor={(item) => item.id} renderItem={({ item, index }) => {
                            return (
                                <View style={styles.productItem}>
                                    <Image source={{ uri: item.product.productimage }} style={styles.productImage}>
                                    </Image>

                                    <View style={styles.centerView}>
                                        <Text style={styles.name}>{item.product.producttitle}</Text>
                                        <Text style={styles.text}>{item.producttext}</Text>
                                        <View style={styles.priceView}>
                                            <Text style={styles.desc} >{"\nRs:"} {item.product.price * item.qty}</Text>

                                        </View>

                                    </View>
                                </View>
                            );
                        }}
                    />
                    <Text style={styles.text1} >Date : {orderData.Date}</Text>
                    <Text style={styles.text1} >Personal Information</Text>
                    <Text style={styles.text}>Name: {orderData.Name}</Text>
                    <Text style={styles.text}>Email: {orderData.Email}</Text>
                    <Text style={styles.text}>Contact: {orderData.phonenumber}</Text>
                    <Text style={styles.text1} >Shipping Address</Text>
                    <Text style={styles.text}>{orderData.fulladdress}</Text>
                    <Text style={styles.text1} >Payment Method</Text>
                    <Text style={styles.text}>Cash On Delivery</Text>
                    <View >
                        <Text style={styles.text1} >Total Billing Summary</Text>
                        <Text style={styles.text}>Total Items: {orderData.TotalQty}</Text>
                        <Text style={styles.text}>Total Price: Rs {orderData.TotalPrice}</Text>
                        < Text style={styles.text}>Delivery Charges: Rs.{orderData.deliverycharges}</Text>
                        <Text style={styles.text}>Total Amount: Rs.{orderData.TotalAmount}</Text>
                    </View>
                </View>
            
            <View style={styles.btncontainer}>
                <TouchableOpacity style={styles.button} onPress={handleCombinedClick}
                >
                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 700 }}>
                        Confirm
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default OrderSummary;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 7,
        paddingBottom: 100,
        backgroundColor: 'white'

    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: "black",
        marginTop: 7,
        marginLeft: 10
    },
    productItem: {
        width: Dimensions.get('window').width,
        height: 100,
        backgroundColor: '#E9D6D6',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,



    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginLeft: 10,
        backgroundColor: 'white'
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: 'black',
    },
    desc: {
        fontSize: 15,
        fontWeight: '600',
        color: 'black',
    },

    text: {
        fontSize: 16,
        color: 'black',

        padding: 3,
        fontSize: 18,

        marginLeft: 10,

    },
    text1: {
        fontSize: 19,
        color: 'green',
        fontWeight: 'bold',
        marginLeft: 10,

    },
    priceView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightView: {
        marginLeft: 10,
        alignItems: 'center',
    },
    centerView: {
        marginLeft: 10,
        width: '40%',
    },

    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: 'white'

    },
    quantityButton: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        color: 'black',
        backgroundColor: 'white'

    },
    quantity: {
        fontSize: 18,
        marginHorizontal: 10,
        color: 'black',
        backgroundColor: 'white'
    },

    totalText: {
        fontSize: 18,

        width: 300,

        color: 'black',
        fontSize: 20,
        fontWeight: 700,
        marginTop: 10
    },
    userdata: {

        height: 45,
        alignContent: 'center',
        color: 'black',
        padding: 3,
        fontSize: 18,

        marginLeft: 10,
    },
    btncontainer: {
        alignItems: "center"
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