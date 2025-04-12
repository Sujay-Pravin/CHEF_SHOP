import {createContext, useEffect, useState} from 'react';
import axios from "axios"


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [token,setToken] = useState("");
    const url = import.meta.env.VITE_API_URL || "---add appropriate api url here---";
    const [food_list,setFoodList] = useState([])

    const addToCart = async (itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev) => ({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev) => ({...prev,[itemId]:prev[itemId]+1}))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({...prev,[itemId]:prev[itemId]-1}))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

     const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalAmount += food_list.find((food) => food._id === item).price * cartItems[item];
            }
        }
        return totalAmount;
     }

     const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setFoodList(response.data.food || []); // Changed from data to food
            } else {
                console.error("Failed to fetch food list");
                setFoodList([]);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
            setFoodList([]);
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData)
    }

     useEffect (() => {
        
            async function loadData(){
                await fetchFoodList();
                const savedToken = localStorage.getItem("token");
                if (savedToken) {
                    setToken(savedToken);
                    await loadCartData(localStorage.getItem("token"))
                }
            }
            loadData();
     },[])
    
    const contextValue = {
         food_list,
         cartItems,
         setCartItems,
         addToCart,
         removeFromCart,
         getTotalCartAmount,
         url,
         token,
         setToken
    }

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;