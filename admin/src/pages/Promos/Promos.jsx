import React, { useEffect, useState } from 'react';
import './Promos.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Promos = ({ url }) => {
    const [promos, setPromos] = useState([]);
    const [newPromo, setNewPromo] = useState({ code: '', discount: '' });

    const fetchPromos = async () => {
        try {
            const response = await axios.get(`${url}/api/promo/list`);
            if (response.data.success) {
                setPromos(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch promo codes');
        }
    };

    const createPromo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/promo/create`, newPromo);
            if (response.data.success) {
                toast.success('Promo code created successfully');
                setNewPromo({ code: '', discount: '' });
                fetchPromos();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to create promo code');
        }
    };

    const deletePromo = async (id) => {
        try {
            const response = await axios.delete(`${url}/api/promo/delete/${id}`);
            if (response.data.success) {
                toast.success('Promo code deleted successfully');
                fetchPromos();
            }
        } catch (error) {
            toast.error('Failed to delete promo code');
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    return (
        <div className='promos'>
            <h2>Manage Promo Codes</h2>
            
            <form onSubmit={createPromo} className='promo-form'>
                <input
                    type="text"
                    placeholder="Enter promo code"
                    value={newPromo.code}
                    onChange={(e) => setNewPromo({...newPromo, code: e.target.value})}
                    required
                />
                <input
                    type="number"
                    placeholder="Discount percentage"
                    value={newPromo.discount}
                    onChange={(e) => setNewPromo({...newPromo, discount: e.target.value})}
                    min="0"
                    max="100"
                    required
                />
                <button type="submit">Create Promo Code</button>
            </form>

            <div className="promos-list">
                {promos.map(promo => (
                    <div key={promo._id} className="promo-item">
                        <div className="promo-info">
                            <h3>{promo.code}</h3>
                            <p>{promo.discount}% OFF</p>
                        </div>
                        <button onClick={() => deletePromo(promo._id)} className="delete-btn">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Promos;
