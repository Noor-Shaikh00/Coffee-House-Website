
// =====================================
// COFFEE SHOP WEBSITE - MAIN JAVASCRIPT
// =====================================


// =====================================
// NAVBAR MOBILE MENU
// =====================================

const navLinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

if (menuOpenButton) {
    menuOpenButton.addEventListener("click", () => {
        document.body.classList.toggle("show-mobile-menu");
    });
}

if (menuCloseButton) {
    menuCloseButton.addEventListener("click", () => {
        document.body.classList.remove("show-mobile-menu");
    });
}

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        document.body.classList.remove("show-mobile-menu");
    });
});


// =====================================
// SWIPER SLIDER
// =====================================

if (document.querySelector(".slider-wrapper") && typeof Swiper !== "undefined") {

    const swiper = new Swiper(".slider-wrapper", {
        loop: true,
        grabCursor: true,
        spaceBetween: 25,

        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        }
    });
}


// =====================================
// CONTACT FORM
// =====================================

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        alert("Thank You! Your message has been sent successfully!");

        contactForm.reset();
    });
}


// =====================================
// ORDER FORM
// =====================================

const orderForm = document.querySelector(".order-form");

if (orderForm) {
    orderForm.addEventListener("submit", function(e) {
        e.preventDefault();

        alert("Your Coffee Order Has Been Placed Successfully!");

        orderForm.reset();
    });
}


// =====================================
// GALLERY LIGHTBOX
// =====================================

const galleryImages = document.querySelectorAll(".gallery-image");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxClose = document.querySelector(".lightbox-close");

if (lightbox && lightboxImg) {

    galleryImages.forEach(img => {
        img.addEventListener("click", () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    }

    lightbox.addEventListener("click", e => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
        }
    });
}


// =====================================
// SHOPPING CART - LOCAL STORAGE
// =====================================

const CART_STORAGE_KEY = "coffeeShopCart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}


// =====================================
// ADD PRODUCT TO CART
// =====================================

document.addEventListener("click", function(e) {

    const addButton = e.target.closest(".add-to-cart");

    if (!addButton) return;

    const productId = addButton.dataset.id;
    const productName = addButton.dataset.name;
    const productPrice = Number(addButton.dataset.price);
    const productImage = addButton.dataset.image;

    if (!productId || !productName || !productPrice) {
        alert("Product information is missing!");
        return;
    }

    let cart = getCart();

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage || "",
            quantity: 1
        });
    }

    saveCart(cart);

    alert(productName + " added to your cart successfully!");
});


// =====================================
// CART PAGE - DISPLAY PRODUCTS
// =====================================

function displayCart() {

    const cartItemsContainer = document.getElementById("cart-items");

    if (!cartItemsContainer) return;

    const cart = getCart();

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p class='empty-cart'>Your cart is empty.</p>";
        return;
    }

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-product">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>Rs. ${item.price}</p>
                </div>
            </div>

            <div class="cart-quantity">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>

            <strong>Rs. ${itemTotal}</strong>

            <button class="remove-cart-item" data-id="${item.id}">
                Remove
            </button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    updateCartTotal();
}


// =====================================
// UPDATE CART TOTAL
// =====================================

function updateCartTotal() {

    const subtotalElement = document.getElementById("cart-subtotal");

    if (!subtotalElement) return;

    const cart = getCart();

    const subtotal = cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    subtotalElement.textContent = "Rs. " + subtotal;
}


// =====================================
// INCREASE / DECREASE QUANTITY
// =====================================

document.addEventListener("click", function(e) {

    const quantityButton = e.target.closest(".quantity-btn");

    if (!quantityButton) return;

    const productId = quantityButton.dataset.id;
    const action = quantityButton.dataset.action;

    let cart = getCart();

    const product = cart.find(item => item.id === productId);

    if (!product) return;

    if (action === "increase") {
        product.quantity += 1;
    }

    if (action === "decrease") {
        product.quantity -= 1;
    }

    cart = cart.filter(item => item.quantity > 0);

    saveCart(cart);

    displayCart();
});


// =====================================
// REMOVE PRODUCT FROM CART
// =====================================

document.addEventListener("click", function(e) {

    const removeButton = e.target.closest(".remove-cart-item");

    if (!removeButton) return;

    const productId = removeButton.dataset.id;

    let cart = getCart();

    cart = cart.filter(item => item.id !== productId);

    saveCart(cart);

    displayCart();
});


// =====================================
// LOAD CART WHEN CART PAGE OPENS
// =====================================

displayCart();


// ================= CHECKOUT SYSTEM =================

const checkoutButton = document.getElementById("checkout-button");
const checkoutBill = document.getElementById("checkout-bill");
const placeOrderButton = document.getElementById("place-order-button");

if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {

        const cart = getCart();

        if (cart.length === 0) {
            alert("Your cart is empty. Please add items before checkout.");
            return;
        }

        const billItems = document.getElementById("bill-items");

        let subtotal = 0;
        let billHTML = "";

        cart.forEach(function (item) {

            const itemTotal = Number(item.price) * Number(item.quantity);
            subtotal += itemTotal;

            billHTML += `
                <div class="bill-item">
                    <div>
                        <strong>${item.name}</strong>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <strong>Rs. ${itemTotal.toLocaleString("en-PK")}</strong>
                </div>
            `;
        });

        const deliveryCharge = 100;
        const total = subtotal + deliveryCharge;

        billItems.innerHTML = billHTML;

        document.getElementById("bill-subtotal").textContent =
            "Rs. " + subtotal.toLocaleString("en-PK");

        document.getElementById("bill-delivery").textContent =
            "Rs. " + deliveryCharge;

        document.getElementById("bill-total").textContent =
            "Rs. " + total.toLocaleString("en-PK");

        checkoutBill.style.display = "block";

        checkoutBill.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        placeOrderButton.disabled = false;
        placeOrderButton.innerHTML =
            '<i class="fa-solid fa-check-circle"></i> Place Order';
    });
}


// ================= PLACE ORDER =================

if (placeOrderButton) {
    placeOrderButton.addEventListener("click", function () {

        const cart = getCart();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const confirmOrder = confirm(
            "Are you sure you want to place your order?"
        );

        if (!confirmOrder) {
            return;
        }

        saveCart([]);

        displayCart();

        placeOrderButton.textContent = "Order Placed Successfully!";
        placeOrderButton.disabled = true;

        alert("Thank you! Your order has been placed successfully.");
    });
}
