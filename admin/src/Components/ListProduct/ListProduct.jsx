import React, { useState, useEffect } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = () => {
    fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched products:', data);
        setAllProducts(data); 
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id)=>{
await fetch('http://localhost:4000/removeproduct', {
method: 'POST',
headers: {
Accept: 'application/json',
'Content-Type': 'application/json',
},
body:JSON.stringify({id:id})
})
await fetchInfo();
  }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className='listproduct-format-main'>
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className='listproduct-allproducts'>
        <hr />
        {allproducts.length > 0 ? (
          allproducts.map((product, index) => {
            return <>
            <div key={index} className='listproduct-format-main listproduct-format'>
              <img
                src={product.image}
                alt={product.name}
                className='listproduct-product-icon'
              />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={()=>{remove_product(product.id)}} className='listproduct-remove-icon' src={cross_icon} alt='remove'/>
            </div>
            <hr />
            </>
})
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default ListProduct;
