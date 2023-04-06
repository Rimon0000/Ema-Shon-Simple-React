import { getShoppingCart } from "../utilities/fakedb"

const CartProductsLoader = async () => {
    const loadedProducts = await fetch('products.json')
    const products = await loadedProducts.json()

    //if cart data is in database, You have to use async await
    const storedCart = getShoppingCart()

    const savedCart = []

    for(const id in storedCart){
        const addedProduct = products.find(pd => pd.id === id)
        if(addedProduct){
            const quantity = storedCart[id]
            addedProduct.quantity = quantity
            savedCart.push(addedProduct)
        }
    }

    // if you need to send to things 
    // return [products, savedCart]
    //Another option
    // {products, savedCart}

    return savedCart

}

export default CartProductsLoader