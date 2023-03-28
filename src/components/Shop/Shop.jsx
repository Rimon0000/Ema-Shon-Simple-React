import React, { useEffect, useState } from 'react';
import { addToDb, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'

const Shop = () => {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])

    useEffect( ()=> {
        fetch('products.json')
        .then(res => res.json())
        .then(data => setProducts(data))
    }, [])

    //data interact korbo with outside code/localStorage 
    useEffect( () =>{
        const storedCart = getShoppingCart()
        const savedCart = [];

        //step-1: get id of the added product
        for(const id in storedCart){
            //step-2: get product from products using id
            const addedProduct = products.find(product => product.id === id)
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
    }, [products])    //(products)-defendency dite hobe cz data load howa asyncronus. tai 1st ekbar call hobe and data change hole abr call korbe


    const handleAddToCart = (product) => {
        // cart.push(product)

        //advance (optional)
        let newCart = []
        // const newCart = [...cart, product]
        //if product doesn't exist in the cart thens et quantity = 1
        //if exist update quantity by 1
        const exist = cart.find(pd => pd.id === product.id)
        if(!exist){
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else{
            exist.quantity = exist.quantity + 1;
            const remaining = cart.filter(pd => pd.id !== product.id)
            newCart = [...remaining, exist]
        }




        setCart(newCart)
        addToDb(product.id)
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product 
                        product={product}
                        key={product.id}
                        handleAddToCart = {handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart cart={cart}></Cart>
            </div>
        </div>
    );
};

export default Shop;