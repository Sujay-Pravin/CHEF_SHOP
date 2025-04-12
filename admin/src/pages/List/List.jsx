import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import {toast} from "react-toastify"

const List = ({url}) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchList = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/api/food/list`)

      if (response.data.success) {
        // Changed from data to food to match API response
        setList(response.data.food || [])
      } else {
        toast.error("Failed to fetch food items")
        setList([])
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error("Error loading food items")
      setList([])
    } finally {
      setLoading(false)
    }
  }

  const removeFood = async(foodId) => {
    const response = await axios.post(
      `${url}/api/food/remove`,{id:foodId}
    );
    await fetchList();
    if(response.data.success){
      toast.success(response.data.message)
    }
    else{
      toast.error("Error, cant delete data")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {loading ? (
          <div className="list-table-format">
            <p>Loading food items...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="list-table-format">
            <p>No food items found</p>
          </div>
        ) : (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img 
                src={`${url}/images/${item.image}`} 
                alt={item.name || 'Food item'} 
              />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <p className="cursor" onClick={() => removeFood(item._id)}>X</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default List
