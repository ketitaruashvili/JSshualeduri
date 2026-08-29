let products = [];

const fetchData = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=40");
    const data = await response.json();
    products = data.products.map((product) => ({ ...product, quantity: 0 }));
    displayProducts(products);
    displayCartSummary();
  } catch (error) {
    console.log(error);
  }
};
fetchData();

const searchInput = document.querySelector(".search-value");
searchInput.addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(value),
  );
  displayProducts(filteredProducts);
});

const displayProducts = (productsToRender) => {
  const productsList = document.querySelector(".products-list");
  productsList.innerHTML = "";

  if (productsToRender.length === 0) {
    productsList.innerHTML = `<div class="no-results">პროდუქტი ვერ მოიძებნა</div>`;
    return;
  }

  productsToRender.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("card");
    productCard.innerHTML = `
        <img src="${product.thumbnail}" class="thumbnail" alt="${product.title}"/>
        <div class="product-info">
              <h3>${product.title}</h3>
              <p class="description">${product.description}</p>
              <p class="price">${Math.round(product.price).toLocaleString()} GEL</p>
              <div class="meta">
                <span>Brand: ${product.brand ?? "-"}</span>
                <span>Stock: ${product.stock}</span>
              </div>
              <div class="quantity-controls">
                <button class="decrease">-</button>
                <span class="quantity">${product.quantity}</span>
                <button class="increase">+</button>
              </div>
        </div>
    `;

    const decreaseBtn = productCard.querySelector(".decrease");
    const increaseBtn = productCard.querySelector(".increase");
    const quantitySpan = productCard.querySelector(".quantity");

    decreaseBtn.disabled = product.quantity <= 0;
    increaseBtn.disabled = product.quantity >= product.stock;

    decreaseBtn.addEventListener("click", () => {
      if (product.quantity > 0) {
        product.quantity--;
        quantitySpan.textContent = product.quantity;
        decreaseBtn.disabled = product.quantity <= 0;
        increaseBtn.disabled = product.quantity >= product.stock;
        displayCartSummary();
      }
    });

    increaseBtn.addEventListener("click", () => {
      if (product.quantity < product.stock) {
        product.quantity++;
        quantitySpan.textContent = product.quantity;
        decreaseBtn.disabled = product.quantity <= 0;
        increaseBtn.disabled = product.quantity >= product.stock;
        displayCartSummary();
      }
    });

    productsList.appendChild(productCard);
  });
};

const displayCartSummary = () => {
  const totalPriceEl = document.querySelector(".total-price");
  const priceSum = products.reduce((acc, currentProduct) => {
    return acc + currentProduct.price * currentProduct.quantity;
  }, 0);
  totalPriceEl.textContent = `Total Price: ${Math.round(priceSum).toLocaleString()} GEL`;
};
