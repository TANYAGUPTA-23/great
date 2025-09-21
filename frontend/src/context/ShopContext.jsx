import { createContext, useEffect, useState } from "react"; 
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext(); 

const ShopContextProvider = (props) => { 
    const currency = '$'; 
    const delivery_fee = 10; 
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    console.log(backendUrl);

    const buildUrl = (path) => {
        return `${backendUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    };

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        if(!size){
            toast.error('Select Product Size'); //If the user hasn’t selected a size, it shows an error toast message and stops execution.
            return;
        }
        let cartData = structuredClone(cartItems); //makes a deep copy of the current cartItems so that changes don’t directly mutate the original state
        if(cartData[itemId]){                      //If the product (itemId) already exists:
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;       //If the selected size already exists, increase quantity by 1.
            }
            else{
                cartData[itemId][size] = 1;        //Else, add the size with quantity 1.
            }
        }
        else{                                      //If the product doesn’t exist at all in the cart:
            cartData[itemId] = {};
            cartData[itemId][size] = 1;            //Create a new entry for it and set quantity to 1.
        }
        setCartItems(cartData); //Updates React’s cartItems state with the new cart data.

        if(token){ //If the user has a token (meaning they are logged in)
            try{
                await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers:{token}});  //Passes the token in headers for authentication.
            }
            catch(error){
                console.log(error);
                toast.error(error.message);
            }
        }
    };
       
    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){              //items here is actually the itemId key in the cartItems object.
            for(const item in cartItems[items]){    //item here is the size (e.g., "M", "L") stored under that product ID.
                try{
                    if(cartItems[items][item] > 0){
                        totalCount += cartItems[items][item];
                    }
                }
                catch(error){}
            }   
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if(token){
            try{
                await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers: {token}});
            }
            catch(error){
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){   //items is the product ID (itemId).
            let itemInfo = products.find((product) => product._id === items);   //Searches in the products array to get full details like price, name, etc., for the current item in the cart.
            for(const item in cartItems[items]){  //item here is the product size (e.g., "M", "L").
                try{
                    if(cartItems[items][item] > 0){
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                }
                catch (error){}
            }
        }
        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if(response.data.success){
                setProducts(response.data.products);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch (error){
            console.log(error);
            toast.error(error.message);
        }
    };

    // Load cart from localStorage on mount if not logged in
    useEffect(() => {
        if (!token) {
            const localCart = localStorage.getItem('cartItems');
            if (localCart) {
                setCartItems(JSON.parse(localCart)); //This allows guest users to keep their cart after page refresh.
            }
        }
    }, []);

    // Save cartItems to localStorage when cartItems change and no token (guest)
    useEffect(() => {
        if (!token) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, token]);   //Runs whenever cartItems or token changes.

    // When token changes (user logs in), clear localStorage cart and fetch user cart from backend
    //Ensures that logged-in users always see their server-side cart.
    useEffect(() => {
        if (token) {
            localStorage.removeItem('cartItems'); //Removes the localStorage cart (to avoid conflicts).
            getUserCart(token);
        }
    }, [token]);

    const removeFromCart = async (itemId, size) => {
    console.log('RemoveFromCart called with:', itemId, size);
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
        if (size in cartData[itemId]) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {  //If all sizes for an item are removed, delete the whole itemId from the cart.
                delete cartData[itemId];
            }
            setCartItems(cartData);
            console.log('Cart after removal:', cartData);
            if (token) {
                try {
                    const res = await axios.post(buildUrl('/api/cart/remove'), { itemId, size }, { headers: { token } });
                    console.log('Backend response for removal:', res.data);
                } catch (error) {
                    console.error('Error in remove API:', error);
                    toast.error(error.message);
                }
            }
        }
    }
};



    const getUserCart = async (token) => {
        try{
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}});
            if(response.data.success){
                setCartItems(response.data.cartData);
            }
        }
        catch (error){
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(()=>{
        getProductsData();
    }, [token]);

    useEffect(()=>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    }, [token]);

    const value = { 
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, 
        getCartCount, updateQuantity, getCartAmount, removeFromCart,
        navigate, backendUrl, token, setToken,
        setProducts
    }; 

    return ( 
        <ShopContext.Provider value={value}>  {/*Passes all the data & functions  from your value object to every component wrapped inside this provider.*/}
            {props.children}                  {/*Ensures any child components inside <ShopContext.Provider> in the component tree get access to that shared value through useContext(ShopContext). */}
        </ShopContext.Provider>               
    ); 
}; 
//it’s the “global data sharing point” for your shop — your single source of truth for products, cart, and authentication state.
export default ShopContextProvider; //This allows you to import it anywhere without using curly braces:
