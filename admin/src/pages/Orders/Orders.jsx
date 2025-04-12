import React, { useEffect, useState } from 'react'
import './Orders.css'
import { assets } from '../../assets/assets'

const Orders = ({url}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/order/list`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await fetch(`${url}/api/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          status: event.target.value
        })
      });
      const data = await response.json();
      if (data.success) {
        await fetchAllOrders();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  const filterOrders = (orders, type) => {
    return type === 'active' 
        ? orders.filter(order => order.status !== 'Delivered')
        : orders.filter(order => order.status === 'Delivered');
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!orders.length) return <div>No orders found</div>;

  const OrderDetailsModal = ({ order, onClose }) => (
    <div className="order-details-modal" onClick={onClose}>
      <div className="order-details-content" onClick={e => e.stopPropagation()}>
        <div className="order-details-header">
          <h3>Order Details</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="order-details-body">
          <div className="customer-info">
            <h4>Customer Information</h4>
            <p><strong>Name:</strong> {order.address.firstName} {order.address.lastName}</p>
            <p><strong>Phone:</strong> {order.address.phone}</p>
            <p><strong>Email:</strong> {order.address.email}</p>
          </div>
          <div className="order-items">
            <h4>Order Items</h4>
            <div className="items-grid">
              <div className="items-header">
                <span>Item</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                  <span>₹{item.price}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{order.amount - 15}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹15</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{order.amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='order add'>
      <h3>Orders ({orders.length})</h3>
      <div className="order-tabs">
        <button 
          className={activeTab === 'active' ? 'active' : ''} 
          onClick={() => setActiveTab('active')}
        >Active Orders</button>
        <button 
          className={activeTab === 'delivered' ? 'active' : ''} 
          onClick={() => setActiveTab('delivered')}
        >Delivered Orders</button>
      </div>
      <div className="order-list">
        {filterOrders(orders, activeTab).map((order, index) => (
          <div className="order-item" key={order._id || index}>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => (
                  `${item.name} x ${item.quantity}${idx < order.items.length - 1 ? ', ' : ''}`
                ))}
              </p>
              <p className='order-item-name'>
                {order.address.firstName} {order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street}</p>
                <p>{`${order.address.city}, ${order.address.state}`}</p>
                <p>{order.address.phone}</p>
              </div>
            </div>
            <div className="order-details">
              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>
            </div>
            <div className="order-actions">
              <button 
                className="view-items-btn"
                onClick={() => setSelectedOrder(order)}
              >
                View Details
              </button>
              <select 
                onChange={(e) => statusHandler(e, order._id)} 
                value={order.status}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Processing">Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

export default Orders
