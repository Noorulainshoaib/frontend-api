/*import React, { useEffect, useState } from 'react'
import ProductsModal from '../components/ProductsModal'
import axios from 'axios'
import { BsFillPencilFill } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'


export default function Products(){


 const [Products,setProducts] = useState ([])

 //useEffect (() => {
    //axios.get ('http://localhost:2011/api/all-categories') 
    //.then((json) => setProducts(json.data.categories))
    //.catch((err) => console.log (err))
 //} ,[])

 //const dummy = (params) => console.log("Called" , params)

    return(
        <div className="container">
            <div className="d-flex justify-content-between align-items-center p-2 my-3 rounded" style={{ backgroundColor: '#34495e' }}>
                <span className="fs-4 fw-bold text-white" >Products</span>
                
                <ProductsModal recallData={setProducts}/>
         </div>
<div className="container">

<table className="table">
  <thead>
    <tr>
      <th scope="col">P.ID</th>
      <th scope="col">Products Name</th>
      <th scope="col">Products Image</th>
      <th scope="col">Products Price</th>
    </tr>
  </thead>
  <tbody>
   {
      Products.map((val,key)=>
      <tr key={key}>
      <th scope="row">{val._id}</th>
      <th>{val.Products.Name}</th>
      <th><img src={val.ProductsImage} className='image-fluid' style={{height: '5vh', objectFit: 'contain' }} alt="" srcSet=""/></th>
      <td>
      <button className="btn btn-dark mx-1"><BsFillPencilFill /></button>
      <button className="btn btn-dark mx-1" onClick={() => deleteProduct(val.ProductsName)}><AiFillDelete /></button>
       </td>
    
    </tr>
      )
}
  </tbody>
</table>


</div>

        </div>
    )
}*/
import React, { useEffect, useState } from 'react';
import { BsFillPencilFill } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import ProductsModal from '../components/ProductsModal';
import axios from 'axios';
import { AppRoute } from '../../App';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get('/api/get-all-products')
      .then((response) => setProducts(response.data.products))
      .catch((error) => console.log(error));
  };


  const deleteProduct = (_id) => {
    axios
      .delete('/api/delete-product', { data: { _id } })
      .then(() => {
        fetchProducts();
        setSuccessMessage('Product deleted successfully');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Display for 3 seconds
      })
      .catch((error) => console.log(error));
  };

  const updateProduct = (_id, newData) => {
    axios
      .put('/api/update-product', { _id, ...newData })
      .then(() => {
        fetchProducts();
        setSuccessMessage('Product updated successfully');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Display for 3 seconds
      })
      .catch((error) => console.log(error));
  };
  return (

    <div className="container">
       <div className="position-fixed top-0 end-0 p-3">
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center bg-primary my-2 p-2">
        <span className="fs-4 fw-bold text-white">Products</span>
        <ProductsModal recallData={setProducts} />
      </div>
      <div className="container">
        <table className="table text-white">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Image</th>
              <th scope="col"> Name</th>
              <th scope="col">Category</th>
              <th scope="col">Brand</th>
              <th scope="col">Price</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((val, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <th scope="row">{val._id}</th>
                <td><img src={val.thumbnail} className="img-fluid rounded-circle" style={{ height: '7vh', objectFit: 'contain' }}alt=""/>
                </td>                <td>{val.title || val.productName}</td>
                <td>{val.category}</td>
                <td>{val.brand}</td>
                <td>{val.price}</td>
                <td className="description-cell">{val.description}</td>
               <td>
               <button className="btn btn-light mx-1" style={{ width: '50px' }} onClick={() => {
                      const newCategoryName = prompt('Enter new Product Name:', val.title || val.productName);
                      const newCategoryImage = prompt('Enter new Product Image URL:', val.thumbnail);
                      const newProductCategory = prompt('Enter new Product category name:', val.category);
                      const newProductBrand = prompt('Enter new Brand name:', val.brand);
                      const newProductPrice = prompt('Enter new Price:', val.price);
                      const newProductDes = prompt('Edit your Description:', val.description);
                      if (newCategoryName && newCategoryImage &&  newProductCategory && newProductBrand && newProductPrice && newProductDes ) {
                        updateProduct(val._id, {
                          productName: newCategoryName,
                          thumbnail: newCategoryImage,
                          category : newProductCategory,
                          brand: newProductBrand,
                          price : newProductPrice,
                          description : newProductDes,
                        });
                      }
                    }} >
                    <BsFillPencilFill />
                  </button>
                  <button className='btn btn-light my-1 ' style={{ width: '50px' }}  onClick={()=>deleteProduct(val._id)}>
                    <AiFillDelete />
                  </button>
               </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
