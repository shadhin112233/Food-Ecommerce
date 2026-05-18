import axios from "axios";
import { createContext, useEffect } from "react";
// import { food_list } from "../assets/assets";
import { useState } from "react";



export const StoreContext = createContext(null)

const StoreContextProvider = (props) =>{

    const [cardItem, setCardItem] = useState({});
    const url = "https://food-ecommerce-backendd.onrender.com";

    const [token, setToken] = useState("");

    const [food_list, setFood_list] = useState([])

    const addToCart = async(itemId) =>{
        if (!cardItem[itemId]) {
            setCardItem((prev)=>({...prev,[itemId]:1}))
            
        }
        else{
            setCardItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }

        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }

    }

    const removeFromCart = async(itemId)=>{
        setCardItem((prev)=>({...prev,[itemId]:prev[itemId]-1}));

        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})

        }

    }

   const getTotalCardAmount = () =>{
    let totalAmount = 0;
    for(const item in cardItem){
        if (cardItem[item]>0) {
            let itemInfo = food_list.find((product)=>product._id===item)
        totalAmount += itemInfo.price* cardItem[item];
            
        }


        

    }
    return totalAmount
   }

   const fetchFoodlist = async() =>{
    const response = await axios.get(url+"/api/food/list");
    setFood_list(response.data.data)
   }

   const loadCartData = async(token) =>{
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
    setCardItem(response.data.cartData)

   }




   useEffect(() => {
     
     async function loadData() {
        await fetchFoodlist()
        if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"))
        await loadCartData(localStorage.getItem("token"));
     }
     }

     loadData()


   }, [])



    const contextValue = {
        food_list,
        cardItem,
        cartItems: cardItem,
        setCardItem,
        addToCart,
        removeFromCart,
        getTotalCardAmount,
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

export default StoreContextProvider
