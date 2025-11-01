document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-container");
  if (!cartContainer) return;

  const cartLink = document.getElementById("cart-link");

  let miniCart = document.getElementById("mini-cart");
  if (!miniCart) {
    miniCart = document.createElement("div");
    miniCart.id = "mini-cart";
    miniCart.className = "mini-cart";
    miniCart.innerHTML = `
      <h4>Carrito</h4>
      <ul id="cart-items"></ul>
      <p id="cart-empty">El carrito está vacío</p>
      <p id="cart-total">Total: $0</p>
    `;
    cartContainer.appendChild(miniCart);
  }

  const cartItemsList = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartTotal = document.getElementById("cart-total");
  const contador = document.getElementById("cart-count");

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  contador.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function actualizarMiniCart() {
    cartItemsList.innerHTML = "";

    if(cartItems.length === 0) {
      cartEmpty.style.display = "block";
      cartTotal.textContent = "Total: $0";
      contador.textContent = 0;
    } else {
      cartEmpty.style.display = "none";
      let total = 0;

      cartItems.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${item.name} x${item.quantity}</span>
          <span>$${item.total.toLocaleString()}</span>
        `;

        const btn = document.createElement("button");
        btn.textContent = "X";
        btn.addEventListener("click", () => {
          cartItems.splice(index, 1);
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          contador.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          actualizarMiniCart();
        });

        li.appendChild(btn);
        cartItemsList.appendChild(li);
        total += item.total;
      });

      cartTotal.textContent = `Total: $${total.toLocaleString()}`;
    }
  }

  cartLink.addEventListener("click", (e) => {
    e.preventDefault();
    miniCart.style.display = miniCart.style.display === "block" ? "none" : "block";
  });

  function agregarAlCarrito(nombre, precioUnitario, quantity, totalConDescuento = null) {
    const index = cartItems.findIndex(item => item.name === nombre);
    const total = totalConDescuento !== null ? totalConDescuento : precioUnitario * quantity;

    if(index >= 0) {
      cartItems[index].quantity += quantity;
      cartItems[index].total += total;
    } else {
      cartItems.push({ name: nombre, quantity: quantity, total: total });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    contador.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    actualizarMiniCart();
    mostrarMensaje(`${nombre} fue agregado al carrito 🛒`);
  }

  // Botones agregar al carrito
  const botones = document.querySelectorAll(".add-to-cart");
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const card = boton.closest(".product-card");
      const nombre = card.querySelector(".product-name").textContent;
      const precio = parseInt(card.querySelector(".product-price").dataset.price || card.querySelector(".product-price").textContent.replace(/\D/g,''));
      const qty = parseInt(card.querySelector(".qty-input") ? card.querySelector(".qty-input").value : 1);

      if(qty <= 0) return;

      // Tomamos el total con descuento si existe, si no usamos precio normal
      let totalConDescuento = null;
      const cardTotalElem = card.querySelector(".card-total");
      if(cardTotalElem) {
        totalConDescuento = parseInt(cardTotalElem.textContent.replace(/\D/g,''));
      }

      agregarAlCarrito(nombre, precio, qty, totalConDescuento);

      if(card.querySelector(".qty-input")) {
        card.querySelector(".qty-input").value = 0;
        const event = new Event('input');
        card.querySelector(".qty-input").dispatchEvent(event);
      }
    });
  });

  actualizarMiniCart();
});

function mostrarMensaje(texto) {
  const mensaje = document.createElement("div");
  mensaje.className = "mensaje-carrito";
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);

  setTimeout(() => {
    mensaje.classList.add("oculto");
    setTimeout(() => mensaje.remove(), 500);
  }, 2500);
}





