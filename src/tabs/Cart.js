import { Dimensions, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
    const [cartList, setCartList] = useState([]);
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);

    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

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

    const increaseQuantity = (itemId) => {
        const updatedCart = cartItems.map((item) =>
            item.id === itemId ? { ...item, qty: item.qty + 1 } : item
        );
        setCartItems(updatedCart);

        // Update the quantity in Firestore
        firestore()
            .collection(`Cart-${userData.uid}`)
            .doc(itemId)
            .update({
                qty: firestore.FieldValue.increment(1), // Increment the quantity by 1
            })
            .catch((error) => {
                console.error('Error updating quantity:', error);
            });
    };
    const decreaseQuantity = (itemId) => {
        const updatedCart = cartItems.map((item) =>
            item.id === itemId
                ? { ...item, qty: item.qty > 0 ? item.qty - 1 : 0 }
                : item
        );
    
        // Filter out items with quantity 0
        const filteredCart = updatedCart.filter((item) => item.qty > 0);
    
        setCartItems(filteredCart);
    
        // If the quantity is greater than 0, update the quantity in Firestore
        if (filteredCart.length > 0) {
            firestore()
                .collection(`Cart-${userData.uid}`)
                .doc(itemId)
                .update({
                    qty: firestore.FieldValue.increment(-1), // Decrement the quantity by 1
                })
                .catch((error) => {
                    console.error('Error updating quantity:', error);
                });
        } else {
            // If the quantity is 0, delete the item from Firestore
            firestore()
                .collection(`Cart-${userData.uid}`)
                .doc(itemId)
                .delete()
                .catch((error) => {
                    console.error('Error deleting item:', error);
                });
        }
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Cart Items</Text>
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


                            <View style={styles.rightView}>

                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                                        <Text style={styles.quantityButton}>{'-'}</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantity}>{item.qty}</Text>
                                    <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                                        <Text style={styles.quantityButton}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>



                        </View>
                    );
                }}
            />
            <View style={styles.header}>
                <Text style={styles.totalText}>Total Items: {totalItems}</Text>
                <Text style={styles.totalText}>Total Price: Rs {totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.btncontainer} onPress={() => {
                navigation.navigate('Checkout')
            }} >
                <Text style={styles.button}
                >
                    Checkout
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default Cart;

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
        color: 'green',
        fontWeight: 'bold',

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
        fontWeight: 'bold',
        color: 'black'
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginTop: 10, // Adjust the spacing as needed
        borderTopWidth: 1,

        paddingTop: 10,
        alignItems: 'flex-end',

        borderTopColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: 'red', // Background color of the bottom view
    },
    btncontainer: {
        alignItems:"center",
       
    },
    button: {
        borderWidth: 1,
        padding: 18,
        borderColor: 'pink',
        borderRadius: 20,
        backgroundColor: '#C58D8D',
        width: 300,
        textAlign: 'center', 
        color: 'white', 
        fontSize: 20, 
        fontWeight: 700,
        marginTop:10
    },


});