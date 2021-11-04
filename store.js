//checks if document is loaded before running script
if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
} else{
    ready()
}

let itemNames = []
let itemQuants = []
let itemPrices = []
let itemSources = []

function ready() {
    //add listeners to buttons

    //remove from cart
    var removeCartButtons = document.getElementsByClassName('btn-remove')
    console.log(removeCartButtons)
    for (var i = 0; i< removeCartButtons.length; i++){
        var button = removeCartButtons[i]
        button.addEventListener('click', removeCartItem)
    }
    //change quantity in cart
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    //add to cart
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++){
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
    
}

function purchaseClicked(){
    //set HTML cart items to variables
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')

    // for every item(row) in the cart, take the data and push it to an array
    for(i=0;i<cartRows.length;i++){
        //set variable for current row
        //probably should be named 'currentRow' but whatever
        var cartRow = cartRows[i]
        //grab data
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var imageSrc = cartRow.getElementsByClassName('cart-item-image')[0].id
        var quantity = quantityElement.value
        //add data to arrays
        itemNames.push(title)
        itemQuants.push(quantity)
        itemPrices.push(price)
        itemSources.push(imageSrc)
    }
    //store data as localStorage
    //stringify array data
    localStorage.setItem("prices", JSON.stringify(itemPrices));
    localStorage.setItem("names", JSON.stringify(itemNames));
    localStorage.setItem("quants", JSON.stringify(itemQuants));
    localStorage.setItem("srcs", JSON.stringify(itemSources));
    //localStorage.setItem("name on localStorage", variable name)
    }

function checkout(){
    //turn stringified array data back into an array (doesnt register as an arrat without this)
    var storedNames = JSON.parse(localStorage.getItem("names"));
    var storedQuants = JSON.parse(localStorage.getItem("quants"));
    var storedPrices = JSON.parse(localStorage.getItem("prices"));
    var storedSources = JSON.parse(localStorage.getItem("srcs"));

    //for the number of items, fill the cart and form using the data
    for(var i = 0;i<storedNames.length;i++)fillCart(storedNames[i], storedPrices[i], storedQuants[i], storedSources[i], i)
}

function fillCart(title, price, quant, src, count){
    //copied from adding to cart on index
    //creates the div and adds class
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.innerText = title
    var cartItems = document.getElementsByClassName('checkout-items')[0]
    //create a var of HTML that will be used to make items in the cart
    var cartRowContent =`
    <div class="cart-item cart-column ">
        <div class="cart-item-image" id="${src}" width="100" height="100"></div>
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <span class="checkout">${quant}</span>
        </div>`
    //adds HTML code to div
    cartRow.innerHTML = cartRowContent
    //put the div inside of other div
    cartItems.append(cartRow)
    //take the item name and create a hidden input
    var itemName = document.createElement('input')
    itemName.classList.add('purchasedItem-'+count)
    itemName.type='hidden'
    itemName.value=title
    //take the item quantity and create a hidden input
    var itemQuant = document.createElement('input')
    itemQuant.classList.add('purchasedQuant-'+count)
    itemQuant.type='hidden'
    itemQuant.value=quant
    //defining the form itself as a variable
    var form = document.getElementById('checkoutForm')
    //only the first time, add the total to both the form and under the cart
    if(count==0){
        //grab total, make variable (unnessesary but nice)
        var totalValue = localStorage.getItem(total)
        //variable for input
        var total = document.createElement('input')
        //add identifier
        total.classList.add('checkoutTotal')
        //set as hidden
        total.type='hidden'
        //set value
        total.value=localStorage.total
        //place inside of form
        form.append(total)
        //set total under cart
        document.getElementsByClassName('purchaseTotal')[0].innerText = '$' + localStorage.total

    }
    //add item inputs
    form.append(itemName)
    form.append(itemQuant)
}

function removeCartItem(event) {
    //removes item from cart and updates total in cart
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    //increase/decrease quantity
    //set limits on quantity value
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
    //set variable for the item clicked
    var shopItem = button.parentElement
    //grab data from item element
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].id
    //this puts data in console to verify but isnt necessary anymore
    // console.log(title, price, imageSrc)
    //adds item to cart and updates
    addItemToCart(title, price, imageSrc, cartNumb)
    updateCartTotal()
    //activate purchase btn now that there is an item to buy
    document.getElementsByClassName('btn-checkout')[0].addEventListener('click', purchaseClicked)
}

function addItemToCart(title, price, imageSrc){
    //similar to fillCart()

    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    //put title in HTML
    cartRow.innerText = title
    //create variable for class
    var cartItems = document.getElementsByClassName('cart-items')[0]
    //make sure there are no duplicate items
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
            alert('This item has already been added to the cart')
            return
        }
    }
    //construct cart item element
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
    //add code to cartRow
    cartRow.innerHTML = cartRowContent
    //place cartRow inside of cartItems div
    cartItems.append(cartRow)
    //activate button to remove item
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',
    removeCartItem)
    //activate button to change quantitiy
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener
    ('change', quantityChanged)
}

function updateCartTotal(){
    //set divs as varibles
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    //create total variable
    var total = 0
    //for every item in cart do this
    for (var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i]
        //grab values for calculating total price of cart
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        //log values to verify
        // console.log(price * quantity)
        // console.log(quantity)
        // console.log(title)
        //calculate total
        total = total + (price * quantity)
    }
    //round total to dollar amount
    total = Math.round(total * 100) / 100
    //put total on page
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    //store total
    localStorage.setItem("total", total)
}
