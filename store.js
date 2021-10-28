if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}

let cartNumb = 0

const itemNames = JSON.parse(localStorage.itemNames || '[]');
//let itemNames = []
let itemQuants = []
let itemPrices = []


function ready() {
    var removeCartButtons = document.getElementsByClassName('btn-remove')
    console.log(removeCartButtons)
    for (var i = 0; i< removeCartButtons.length; i++){
        var button = removeCartButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++){
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

}

function purchaseClicked(){

    var cartItems = document.getElementsByClassName('cart-items')[0]
    
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')

    for(i=0;i<cartRows.length;i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        itemNames.push(title)
        itemQuants.push(quantity)
        itemPrices.push(price)
        localStorage.setItem(itemNames, itemNames)
        alert(localStorage.getItem(itemNames))
    }

    // for(let i = 0; i < itemNames.length; i++){
    //     console.log(itemNames[i]);
    //   }
    //   for(let i = 0; i < itemQuants.length; i++){
    //     console.log(itemQuants[i]);
    //   }
    //   for(let i = 0; i < itemPrices.length; i++){
    //     console.log(itemPrices[i]);
    //   }
        var cartItems = document.getElementsByClassName('cart-items')[0]
        while (cartItems.hasChildNodes ()){
            cartItems.removeChild(cartItems.firstChild)
        }
            updateCartTotal()

        /*

        purchase clicked should:
        take cartRow html and move it to checkout page
        redirect to checkout page
        fill info in invisible form

        checkout page should not allow item removal, maybe have a back button that puts items back in cart
        purchase form should have req name and email
        form should somehow send data to database and/email
        maybe use Justis's google sheet first but def not for long
        update stock on admin page when/if thats linked to a database
        */
       
}


function checkout(){
    console.log("its the for loop")
    //set button to send data
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', sendData)
console.log(cartNumb)

//localStorage might not work after page is changed
//NEW PLAN: NEED TO USE JS TO TURN IndeX INTO CHECKOUT PAGE WITHOUT SWITCHING THE FILE
    
    //fill data into cart on checkout page
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0] 
    console.log(itemNames[0])
    console.log(itemPrices[0])
    console.log(itemQuants[0])
    for(i=0;i<itemNames.length;i++){
    // itemNames.push(title)
    // itemQuants.push(quantity)
    // itemPrices.push(price)
    console.log("bad timing ig")
    var cartRowContent =`
    <div class="cart-item cart-column ">

        <span class="cart-item-title">${itemNames[i]}</span>
    </div>
    <span class="cart-price cart-column">${itemPrices[i]}</span>
    <div class="cart-quantity cart-column">
        <p>${itemQuants[i]}</p>
    </div>`
    cartRow.innerHTML = cartRowContent
    cartItems.append(cartRow)
    }

}

function sendData(){
    console.log('DATA SEND SUCCESSFUL')
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1

        alert("There's a remove button for a reason")
    }
    else if (input.value >= 6){
        input.value = 5
        alert("HEY! THAT'S TOO MANY ITEMS!")
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    //event.target
    var button = event.target
    //.parentElement is like .. in powershell
    var shopItem = button.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].id
    cartNumb ++
    console.log(title, price, imageSrc)
    addItemToCart(title, price, imageSrc, cartNumb)
    updateCartTotal()

    document.getElementsByClassName('btn-checkout')[0].addEventListener('click', purchaseClicked)
}

function addItemToCart(title, price, imageSrc, cartNumb){
    console.log(cartNumb)
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.innerText = title
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
            alert('This item has already been added to the cart')
            return
        }
    }
    
    var cartRowContent =`
    <div class="cart-item cart-column ">

        <div class="cart-item-image" id="${imageSrc}" width="100" height="100"></div>

        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">REMOVE</button>
    </div>`
    cartRow.innerHTML = cartRowContent
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',
    removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener
    ('change', quantityChanged)
}

function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        console.log(price * quantity)
        console.log(quantity)
        console.log(title)
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}
