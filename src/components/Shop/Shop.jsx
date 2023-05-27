import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const {totalProducts} = useLoaderData()
    const [currentPage, setCurrentPage] = useState(0)
    const [itemPerPage, setItemPerPage] = useState(10)

    // const itemPerPage = 10;  //TODO: make it dynamic 
    const totalPages = Math.ceil(totalProducts / itemPerPage)

    // const pageNumbers = []
    // for(let i = 0; i <= totalPages; i++){
    //     pageNumbers.push(i)
    // }

    const pageNumbers = [...Array(totalPages).keys()]

    /**
     * Done: 1. Determine the total number of items:
     * TODO: 2. Decide on the number of items per page:
     * Done: 3. Calculate the total number of pages:
     * Done: 4. Determine the current page:
     * 
     */

    // useEffect( ()=> {
    //     fetch('http://localhost:5000/products')
    //     .then(res => res.json())
    //     .then(data => setProducts(data))
    // }, [])

    useEffect(() => {
        async function fetchData() {
          const response = await fetch(`http://localhost:5000/products?page=${currentPage}&limit=${itemPerPage}`);
            const responseData = await response.json();
            setProducts(responseData);
        };
    
        fetchData();
      }, [currentPage, itemPerPage]);


    //data interact korbo with outside code/localStorage 
    useEffect( () =>{
        const storedCart = getShoppingCart()
        const ids = Object.keys(storedCart)

        fetch('http://localhost:5000/productsByIds',{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(ids)
    })
    .then(res => res.json())
    .then(cartProducts => {
        const savedCart = [];

        //step-1: get id of the added product
        for(const id in storedCart){
            //step-2: get product from products using id
            const addedProduct = cartProducts.find(product => product._id === id)
            if(addedProduct){
                //step-3: add quantity
                const quantity = storedCart[id]
                addedProduct.quantity = quantity

                //step-4: add the added product to the saved cart (this is not state array thats why use push method)
                savedCart.push(addedProduct)
            }
            //step-5: set the cart
            setCart(savedCart)
        }
    })

    }, [])    //(products)-defendency dite hobe cz data load howa asyncronus. tai 1st ekbar call hobe and data change hole abr call korbe


    const handleAddToCart = (product) => {
        // cart.push(product)

        //advance (optional)
        let newCart = []
        // const newCart = [...cart, product]
        //if product doesn't exist in the cart then set quantity = 1
        //if exist update quantity by 1
        const exist = cart.find(pd => pd._id === product._id)
        if(!exist){
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else{
            exist.quantity = exist.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id)
            newCart = [...remaining, exist]
        }

        setCart(newCart)
        addToDb(product._id)
    }

    const handleClearCart = () =>{
        setCart([])
        deleteShoppingCart()
    }

    const options = [5, 10, 15, 20]
    const handleSelectChange = (event) => {
        setItemPerPage(parseInt(event.target.value))
        setCurrentPage(0)
    }

    return (
        <>
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product 
                        product={product}
                        key={product._id}
                        handleAddToCart = {handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}
                handleClearCart = {handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                        </Link>
                </Cart>
            </div>
        </div>
        {/* pagination  */}
        <div className="pagination">
            <p>Current Page: {currentPage} amd Item per page: {itemPerPage}</p>
            {
                pageNumbers.map(number => <button 
                    className={currentPage === number ? 'selected' : ''}
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    >{number + 1}</button>)
            }
            <select value={itemPerPage} onChange={handleSelectChange}>
                {
                    options.map(option => <option 
                        key={option}
                        value={option}
                        >{option}</option>)
                }
            </select>
        </div>
        </>
    );
};

export default Shop;