import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PlaceOrder = () => { 
  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const {name, value} = event.target
    setData(prev => ({...prev, [name]: value}))
  }

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
    })
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault()
    
    const res = await initializeRazorpay()
    if (!res) {
      toast.error('Razorpay SDK failed to load')
      return
    }

    try {
      const orderItems = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({
          ...item,
          quantity: cartItems[item._id]
        }))

      const total = getTotalCartAmount() + 15

      // Create Razorpay order
      const response = await axios.post(`${url}/api/payment/create-order`, {
        amount: total
      })

      if (!response.data.success) {
        throw new Error("Failed to create order")
      }

      // Configure Razorpay
      const options = {
        key: response.data.key_id,
        amount: total * 100,
        currency: "INR",
        order_id: response.data.order.id,
        handler: async (paymentResponse) => {
          try {
            // Verify payment and create order
            const orderResponse = await axios.post(
              `${url}/api/order/place`,
              {
                items: orderItems,
                amount: total,
                address: data,
                paymentDetails: paymentResponse
              },
              {
                headers: { token }
              }
            )

            if (orderResponse.data.success) {
              toast.success("Order placed successfully!")
              navigate('/myorders')
            }
          } catch (err) {
            console.error('Order placement failed:', err)
            toast.error('Order placement failed')
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone
        },
        theme: {
          color: "#6366f1"
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error('Order placement failed:', error)
      toast.error(error.message || 'Error placing order')
    }
  }

  const navigate = useNavigate();

  useEffect(()=>{
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
      navigate('/cart')
    }

  },[token])

  return (
    <form onSubmit={handlePlaceOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Info</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name'/>
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name'/>
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email'/>
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street'/>
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State'/>
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code'/>
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country'/>
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone number'/>
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{15}</p>
            </div>
            <hr/>
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+15}</b>
            </div>
            <button type='submit' >PROCEED TO PAYMENT</button>
          </div>
        </div>
      </div>

    </form>
  )
}

export default PlaceOrder
