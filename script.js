let currentCart = [];
const apiUrl = "https://dummyjson.com/carts/15";

const productListElement = document.getElementById("product-list");
const loadingMessageElement = document.getElementById("loading-message");
const searchInputElement = document.getElementById("search-input");
const uniqueProductsCountElement = document.getElementById(
  "unique-products-count"
);
const totalQuantityElement = document.getElementById("total-quantity");
const grandTotalElement = document.getElementById("grand-total");

async function fetchCartData() {
  try {
    loadingMessageElement.style.display = "block";
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();

    currentCart = (data.products || []).map((product) => ({
      ...product,
      quantity: 1,
      total: product.price,
      stock: Math.floor(Math.random() * 50) + 1,
    }));

    renderCart();
  } catch (error) {
    console.error(error);
    productListElement.innerHTML = `<p class="error-message">შეცდომა: ${error.message}</p>`;
  } finally {
    loadingMessageElement.style.display = "none";
  }
}

function renderCart() {
  const searchTerm = searchInputElement.value.toLowerCase().trim();
  const filteredProducts = currentCart.filter((p) =>
    p.title.toLowerCase().includes(searchTerm)
  );

  if (currentCart.length === 0) {
    productListElement.innerHTML = "<p>კალათა ცარიელია.</p>";
    updateSummary();
    return;
  }

  if (filteredProducts.length === 0) {
    productListElement.innerHTML = `<p>პროდუქტი "${searchTerm}" ვერ მოიძებნა.</p>`;
    updateSummary();
    return;
  }

  productListElement.innerHTML = filteredProducts
    .map((product) => {
      const originalIndex = currentCart.findIndex((p) => p.id === product.id);
      return `
            <div class="product-item" data-index="${originalIndex}">
                <img src="${product.thumbnail}" alt="${
        product.title
      }" class="product-thumbnail">
                <div class="product-info">
                    <h3>${
                      product.title
                    } <small style="color: #28a745; margin-left: 10px;">(მარაგშია: ${
        product.stock
      })</small></h3>
                    <div class="product-details">
                        <p>ფასი: <span class="price">$${product.price.toFixed(
                          2
                        )}</span></p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${originalIndex}, -1)">-</button>
                            <span class="quantity-display">${
                              product.quantity
                            }</span>
                            <button onclick="updateQuantity(${originalIndex}, 1)">+</button>
                        </div>
                        <p>ჯამი: <span class="item-total">$${product.total.toFixed(
                          2
                        )}</span></p>
                    </div>
                </div>
                <button class="remove-button" onclick="removeItem(${originalIndex})">
                    <i class="fas fa-trash-alt"></i> წაშლა
                </button>
            </div>
        `;
    })
    .join("");

  updateSummary();
}

window.updateQuantity = (index, change) => {
  const product = currentCart[index];
  if (!product) return;

  const newQuantity = product.quantity + change;
  if (newQuantity <= 0) {
    removeItem(index);
  } else {
    product.quantity = newQuantity;
    product.total = product.price * product.quantity;
    renderCart();
  }
};

window.removeItem = (index) => {
  currentCart.splice(index, 1);
  renderCart();
};

function updateSummary() {
  const totalQuantity = currentCart.reduce((sum, p) => sum + p.quantity, 0);
  const grandTotal = currentCart.reduce((sum, p) => sum + p.total, 0);

  uniqueProductsCountElement.textContent = currentCart.length;
  totalQuantityElement.textContent = totalQuantity;
  grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
}

searchInputElement.addEventListener("input", renderCart);
document.addEventListener("DOMContentLoaded", fetchCartData);
