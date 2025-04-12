import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Cart = () => {
  const {cartItems, food_list, removeFromCart, getTotalCartAmount, url} = useContext(StoreContext)
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }

    if (getTotalCartAmount() === 0) {
      toast.error('Add items to cart before applying promo code');
      return;
    }

    try {
      const response = await axios.post(`${url}/api/promo/validate`, {
        code: promoCode
      });

      if (response.data.success) {
        setAppliedPromo(response.data.data);
        toast.success(`Successfully applied ${response.data.data.code} for ${response.data.data.discount}% off!`);
        setPromoCode(''); // Clear input after successful application
      } else {
        setPromoCode(''); // Clear input on error
        toast.error(response.data.message || 'Invalid promo code');
      }
    } catch (error) {
      setPromoCode(''); // Clear input on error
      toast.error('Error validating promo code');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    toast.info('Promo code removed');
  };

  const calculateTotal = () => {
    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal === 0 ? 0 : 15;
    let total = subtotal + deliveryFee;

    if (appliedPromo) {
      const discount = (subtotal * appliedPromo.discount) / 100;
      total -= discount;
    }

    return total;
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    const subtotal = getTotalCartAmount();
    return (subtotal * appliedPromo.discount) / 100;
  };

  const handlePayment = async () => {
    const res = await initializeRazorpay()
    if (!res) {
      alert('Razorpay SDK failed to load')
      return
    }

    const total = calculateTotal();

    try {
      const response = await axios.post(`${url}/api/payment/create-order`, {
        amount: total
      });

      const options = {
        key: response.data.key_id, // Key will come from backend
        amount: total * 100,
        currency: "INR",
        name: "AskChef",
        description: "Food Order Payment",
        order_id: response.data.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(`${url}/api/payment/verify`, response)
            if (verifyResponse.data.success) {
              navigate('/order')
            }
          } catch (err) {
            console.error('Payment verification failed:', err)
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: "---Customer Name---",
          email: "---Customer Email---",
          contact: "---Contact Number---"
        },
        theme: {
          color: "#6366f1"
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error('Payment initialization failed:', error)
      alert('Payment initialization failed')
    }
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br/>
        <hr/>
        {food_list.map((item,index)=>{
          if(cartItems[item._id]>0){
            return(

              <div key={index}>
                  <div className="cart-items-title cart-items-item">
                    <img src={url+"/images/"+item.image} alt="" />
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>{item.price*cartItems[item._id]}</p>
                    <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                  </div>
                  <hr/>
              </div>
              
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">

          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr/>
            {appliedPromo && (
              <>
                <div className="cart-total-details discount">
                  <p>
                    Discount ({appliedPromo.code})
                    <span className="remove-promo" onClick={removePromoCode}>×</span>
                  </p>
                  <p>-₹{calculateDiscount()}</p>
                </div>
                <hr/>
              </>
            )}
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount()===0?0:15}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{calculateTotal()}</b>
            </div>
            <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
          </div>
        </div>
        <div className="cart-promocode">
            <div>
              <p>If you have a promo code, Enter it here</p>
              <div className="cart-promocode-input">
                <input 
                  type="text" 
                  placeholder='Enter your code here'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                />
                <button onClick={applyPromoCode}>Apply</button>
              </div>
            </div>
         </div>
      </div>
    </div>  
  )
}

export default Cart
