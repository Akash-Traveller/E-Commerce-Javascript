// variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productDOM = document.querySelector(".products-center");

// cart intialise
let cart = [];

//buttons
let buttonDOM = [];

//getting class products
class Products {
    async getProducts(){
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const {title , price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image};
            })
            return products;
        } catch (error) {
            console.log(error)
        }
    }
}

//display products
class UIDisplayProducts {
    displayProducts(products){
    let result = "";
    products.forEach(product => {
        console.log(product)
        result += `
        <!-- single product -->
        <article class="product">
            <div class="img-container">
                <img src=${product.image} alt="product" class="product-img">
                <button class="bag-btn" data-id=${product.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to cart
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
        </article>
        <!-- end single product -->
                `;
    });
    // video watched : 1:54
     productDOM.innerHTML = result;
    }
    getBackButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id)
            if(inCart){
                button.innerText = "In cart";
                button.disabled = true;
            } else {
                button.addEventListener('click',(event) => {
                    event.target.innerText = "In cart";
                    event.target.disabled = true;
                    //get products from id
                    let cartItem = {...LocalStorage.getProduct(id),
                    amount:1  };
                    // add products to cart
                    cart = [...cart,cartItem];
                    console.log(cart)
                    // save the carts in localstorage
                    LocalStorage.saveCart(cart)
                    // set values 
                    this.setCartValues(cart);
                    // display cart items
                    this.addCartItem(cartItem);
                    // show carts
                    this.showCart();
                })
            }
            console.log(id)
        })
    }
    setCartValues(cart){
        let temptotal = 0;
        let itemstotal = 0;
        cart.map(item => {
            temptotal += item.price * item.amount;
            itemstotal += item.amount;
        })
        cartTotal.innerText = parseFloat(temptotal.toFixed(2));
        cartItems.innerText = itemstotal;
        // console.log(cartTotal,cartItems)
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image}>
        <div>
            <h4>${item.title}</h4>
            <h4>$${item.price}</h4>
            <span class="remove-item" data-id=${item.id}>
                remove
            </span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
        `;
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDom.classList.add('showCart');
    }
}

//display localstorgae
class LocalStorage {
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id){
        let product = JSON.parse(localStorage.getItem('products'));
        return product.find(product => product.id === id)
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart));
    }
}

document.addEventListener("DOMContentLoaded",()=> {
    const ui = new UIDisplayProducts();
    const products = new Products();

    //getting all products details
    products.getProducts().then(products => {
        ui.displayProducts(products),
        LocalStorage.saveProducts(products);
    }).then(() => {
        ui.getBackButtons();
    })
})