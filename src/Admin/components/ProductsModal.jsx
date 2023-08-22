/*import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
//import Category from '../pages/Category';
import {storage} from '../utils/FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';

function CategoryModal({recallData}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [CategoryName , setCategoryName] =useState("")
  const [CategoryImage, setCategoryImage]= useState (null)

  const AddCategory =(e)=> {
    e.preventDefault();
  
  
    const storageRef = ref(storage, `images${CategryImage.name}`);
    uploadBytes(storageRef,CategryImage ).then((snapshot) => {
        
        getDownloadURL(snapshot.ref)
  .then((url) => {
    const payload = { CategoryName, CategoryImage: url }
   //axios.post('https://good-erin-goldfish-veil.cyclic.cloud/api/get-all-categories', payload) //remove comment after adding backend add category api
   //.then((json) =>{
    //setShow(false);
    //recallData(json.data).categories;
   //})
 })

  .catch(((error) => alert(error.message) )//console.log(error) 
   
  );
     })
    }
  
  return (
    <>
      <Button variant="dark" onClick={handleShow}>
       Add Category
      </Button>

      <Modal show={show} onHide={handleClose} centered  backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={AddCategory}>
  <div className="mb-3">
    <label htmlFor="CategoryName" className="form-label">
      Category Name
    </label>
    <input
      value={CategoryName}
      onChange={(e) => setCategoryName(e.target.value)}
      className="form-control"
      id="CategoryName"
      aria-describedby="emailHelp"/>
  </div>

  <div className="mb-3">
  <label htmlFor="formFile" className="form-label">
   Category Image
  </label>
  <input className="form-control" onChange={(e) => setCategoryImage(e.target.files[0])} type="file" id="formFile" />
</div>


  <button type="submit" className="btn btn-primary">
    Submit
  </button>
</form>

        
</Modal.Body>
       
      </Modal>
    </>
  );
}

export default CategoryModal;*/
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { storage } from '../utils/FirebaseConfig'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Swal from 'sweetalert2';
import Spinner from 'react-bootstrap/Spinner'; // Import Spinner component
import { AppRoute } from '../../App';

function ProductsModal({ recallData }) {
    const [show, setShow] = useState(false);
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [productName, setProductName] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    // API VALUES
    const [brandVal, setBrandVal] = useState([]);
    const [CategoryVal, setCategoryVal] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setIsLoading(true); // Start loading

        axios.get('/api/get-all-brands').then((json) => {
            setBrandVal(json.data.brands);
            axios.get('/api/get-all-categories').then((json) => {
                setCategoryVal(json.data.category);
                setIsLoading(false); // Stop loading
                setShow(true);
            });
        }).catch((err) => {
            console.log(err);
            setIsLoading(false); // Stop loading in case of error
        });
    };

    const MultipleImageUpload = async () => {
        const promises = images.map((val) => {
            const imageRef = ref(storage, `/images/products/${productName}/${val.name}`);
            return uploadBytes(imageRef, val).then((snapshot) => {
                return getDownloadURL(snapshot.ref);
            });
        });
        return Promise.all(promises);
    };

    const AddProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        try {
            const uploadImageUrls = await MultipleImageUpload();
            const thumbnailRef = ref(storage, `/images/products/${productName}/${thumbnail.name}`);
            const thumbnailSnapshot = await uploadBytes(thumbnailRef, thumbnail);
            const thumbnailUrl = await getDownloadURL(thumbnailSnapshot.ref);

            const payload = {
                productName,
                brand,
                category,
                price,
                images: uploadImageUrls,
                thumbnail: thumbnailUrl,
                description,
            };

            const response = await axios.post('/api/create-product', payload);
            setIsLoading(false); // Stop loading
            setShow(false);
            recallData(response.data.products);

            Swal.fire({
                icon: 'success',
                title: 'Product Added Successfully',
                showConfirmButton: false,
                timer: 3000,
            });
        } catch (error) {
            setIsLoading(false); // Stop loading in case of error
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <>
            <Button variant="dark" style={{ width: '140px' }} onClick={handleShow}>
                Add Product
            </Button>

            <Modal show={show} onHide={handleClose} centered backdrop="static" size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <form onSubmit={AddProduct}>
                            <div className="row">
                                <div className='col'>
                                    <FloatingLabel controlId='productname' label="Product Name" className='mb-3 text-secondary'>
                                        <Form.Control type='text' placeholder='Product Name' value={productName} onChange={(e) => setProductName(e.target.value)}></Form.Control>
                                    </FloatingLabel>
                                </div>
                                <div className="col">
                                    <FloatingLabel controlId="price" label="Product Price ($)" className='mb-3 text-secondary'>
                                        <Form.Control type="number" placeholder='Product Price' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                                    </FloatingLabel>
                                </div>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="thumbnail" className='form-label'>
                                    Product Thumbnail
                                </label>
                                <input className='form-control' onChange={(e) => setThumbnail(e.target.files[0])} type='file' id='thumbnail' />
                            </div>

                            <div className='mb-3'>
                                <p className='mb-0 fw-semibold'>Choose Image</p>
                                <small className='text-secondary'>Double Click to Delete Images</small>
                                <div className='mt-2 d-flex gap-2 align-items-center'>
                                    {
                                        images.map((val, key) =>
                                            <div key={key} className='bg-light border rounded col-md-1'
                                                onDoubleClick={() => setImages(images.filter((img) => img != val))}>
                                                <img style={{ height: '10vh', cursor: 'pointer', objectFit: 'contain' }} className='img-fluid' src={URL.createObjectURL(val)} alt="" />
                                            </div>)
                                    }
                                    <label htmlFor="formFile" style={{ height: '10vh', cursor: 'pointer' }} className='col-md-1 d-flex justify-content-center align-items-center border border-dark rounded'>
                                        +
                                    </label>

                                    <input className='form-control d-none' onChange={(e) => setImages([...images, e.target.files[0]])} type='file' id='formFile' />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <FloatingLabel controlId="floatingSelectBrand" label="Select Brand">
                                        <Form.Select
                                            aria-label="Floating label select brand"
                                            value={brand}              // Set the selected brandName from the state
                                            onChange={(e) => setBrand(e.target.value)}  // Handle brandName change
                                        >
                                            <option value="">Please select a brand</option>
                                            {brandVal.map((val, key) => (
                                                <option key={key} value={val.BrandName}>
                                                    {val.BrandName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                                <div className="col">
                                    <FloatingLabel controlId="floatingSelectCategory" label="Select Category">
                                        <Form.Select
                                            aria-label="Floating label select category"
                                            value={category}              // Set the selected category from the state
                                            onChange={(e) => setCategory(e.target.value)}  // Handle category change
                                        >
                                            <option value="">Please select a Category</option>
                                            {CategoryVal.map((val, key) => (
                                                <option key={key} value={val.CategoryName}>
                                                    {val.CategoryName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </FloatingLabel>
                                </div>
                                <div className="form-floating" style={{ marginTop: "20px" }}>
                                    <textarea
                                        className="form-control"
                                        placeholder="Leave a comment here"
                                        id="description"
                                        style={{ height: 100 }}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <label htmlFor="floatingTextarea2">Description</label>
                                </div>
                                <div className="col-md-12 text-center" style={{ marginTop: "20px" }}>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}


export default ProductsModal;