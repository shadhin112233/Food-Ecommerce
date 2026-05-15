import React, { useContext } from 'react'
import "./Cart.css"
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {


  const {cardItem,food_list,removeFromCart,getTotalCardAmount,url}= useContext(StoreContext);

  const navigate = useNavigate();


  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index)=>{
          console.log(food_list)
          if(cardItem?.[item._id]> 0){
            return(
              <div>
              <div className='cart-items-title cart-item-item'>
               <img src={url+"/images/"+item.image} alt="" />
               <p>{item.name}</p>
               <p>${item.price}</p>
               <p>{cardItem[item._id]}</p>
               <p>${item.price*cardItem[item._id]}</p>
               <p onClick={()=>removeFromCart(item._id)} className='cross'>x</p>

              </div>
              <hr />
              </div>
            )
          }

        })}

        

      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCardAmount()}</p>

            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery fee</p>
              <p>${getTotalCardAmount()===0?0:2}</p>

            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCardAmount()===0?0:getTotalCardAmount()+2}</b>

            </div>
           
          </div>
           <button onClick={()=>navigate("/order")}>PROCCED TO CHECKOUT</button>
        </div>
        <div className="cart-promo-code">
          <div>
            <p>If you have promo code enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Cart
