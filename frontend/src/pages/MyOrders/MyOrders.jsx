import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const {url,token} = useContext(StoreContext);
    const [data,setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trackingOrder, setTrackingOrder] = useState(null);
    const [activeTab, setActiveTab] = useState('active'); // 'active', 'delivered', 'cancelled'

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${url}/api/order/userOrder`, 
                {}, 
                {
                    headers: { token }
                }
            );
            
            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }

    const cancelOrder = async (orderId) => {
        try {
            const response = await axios.post(
                `${url}/api/order/cancel`,
                { orderId },
                { headers: { token } }
            );
            if (response.data.success) {
                fetchOrders();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Failed to cancel order");
        }
    }

    const filterOrders = (orders, type) => {
        switch(type) {
            case 'active':
                return orders.filter(order => 
                    !['Delivered', 'Cancelled'].includes(order.status)
                );
            case 'delivered':
                return orders.filter(order => order.status === 'Delivered');
            case 'cancelled':
                return orders.filter(order => order.status === 'Cancelled');
            default:
                return orders;
        }
    }

    useEffect(() => {
        if(token) {
            fetchOrders();
        }
    }, [token]);

    const getStepStatus = (orderStatus, step) => {
        const steps = ["Order Placed", "Processing", "Out for delivery", "Delivered"];
        const currentIndex = steps.indexOf(orderStatus);
        const stepIndex = steps.indexOf(step);
        
        if (stepIndex < currentIndex) return "step-completed";
        if (stepIndex === currentIndex) return "step-active";
        return "step-pending";
    }

    const TrackingModal = ({order, onClose}) => {
        const steps = [
            {
                status: "Order Placed",
                description: "Your order has been confirmed and is being processed"
            },
            {
                status: "Processing",
                description: "Our kitchen team is preparing your delicious meal"
            },
            {
                status: "Out for delivery",
                description: "Your order is on its way to your location"
            },
            {
                status: "Delivered",
                description: "Enjoy your meal! Thank you for ordering with us"
            }
        ];

        return (
            <div className="tracking-modal" onClick={onClose}>
                <div className="tracking-content" onClick={e => e.stopPropagation()}>
                    <div className="tracking-header">
                        <h3>Order Status</h3>
                        <button onClick={onClose}>&times;</button>
                    </div>
                    <div className="tracking-steps">
                        {steps.map((step, index) => (
                            <div key={index} className="tracking-step">
                                <div className={`step-indicator ${getStepStatus(order.status, step.status)}`}>
                                    {index + 1}
                                </div>
                                <div className="tracking-step-content">
                                    <h4>{step.status}</h4>
                                    <p>{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!token) return <div>Please login to view orders</div>;

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="order-tabs">
                <button 
                    className={activeTab === 'active' ? 'active' : ''} 
                    onClick={() => setActiveTab('active')}
                >Active Orders</button>
                <button 
                    className={activeTab === 'delivered' ? 'active' : ''} 
                    onClick={() => setActiveTab('delivered')}
                >Delivered Orders</button>
                <button 
                    className={activeTab === 'cancelled' ? 'active' : ''} 
                    onClick={() => setActiveTab('cancelled')}
                >Cancelled Orders</button>
            </div>
            <div className="container">
                {filterOrders(data, activeTab).map((order,index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt='' />
                        <p>{order.items.map((item,index) => (
                            `${item.name} x ${item.quantity}${index < order.items.length - 1 ? ', ' : ''}`
                        ))}</p>
                        <p>₹{order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                        <div className="order-actions">
                            {!['Delivered', 'Cancelled'].includes(order.status) && (
                                <button onClick={() => setTrackingOrder(order)}>Track Order</button>
                            )}
                            {order.status === 'Order Placed' && (
                                <button 
                                    onClick={() => cancelOrder(order._id)}
                                    className="cancel-btn"
                                >Cancel Order</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {trackingOrder && (
                <TrackingModal 
                    order={trackingOrder} 
                    onClose={() => setTrackingOrder(null)}
                />
            )}
        </div>
    )
}

export default MyOrders
