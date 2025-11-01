// promociones.js
document.querySelectorAll('.product-card').forEach(card => {
  const qtyInput = card.querySelector('.qty-input');

  // Recalcular en tiempo real cuando cambia la cantidad
  qtyInput.addEventListener('input', () => calcularCard(card));

  // Agregar al carrito
  card.querySelector('.add-to-cart').addEventListener('click', () => {
    const qty = parseInt(qtyInput.value);
    if (qty <= 0) return;

    const { total } = calcularCard(card); // total con descuento
    const productName = card.querySelector('.product-name').innerText;

    // Usar la función de carrito.js
    addToCart(productName, qty, total);

    // Reiniciar input
    qtyInput.value = 0;
    calcularCard(card);
  });
});

function calcularCard(card) {
  const qty = parseInt(card.querySelector('.qty-input').value);
  const price = parseInt(card.querySelector('.product-price').dataset.price);
  const promo = card.dataset.promo;

  if (qty <= 0) {
    card.querySelector('.card-subtotal').innerText = 'Subtotal: $0';
    card.querySelector('.card-discount').innerText = 'Descuento: $0';
    card.querySelector('.card-total').innerText = 'Total: $0';
    return { subtotal: 0, descuento: 0, total: 0 };
  }

  let subtotal = qty * price;
  let descuento = 0;

  // Promo: 50% en segundo
  if (promo === "half-second" && qty >= 2) {
    const sets = Math.floor(qty / 2);
    descuento = sets * (price / 2);
  }

  // Promo: 3x2
  if (promo === "3x2" && qty >= 3) {
    const sets = Math.floor(qty / 3);
    descuento = sets * price;
  }

  // Promo: 20% off en compras mayores a $50.000
  if (promo === "20off50k" && subtotal >= 50000) {
    descuento = subtotal * 0.20;
  }

  const total = subtotal - descuento;

  // Actualizar la card
  card.querySelector('.card-subtotal').innerText = `Subtotal: $${subtotal.toLocaleString()}`;
  card.querySelector('.card-discount').innerText = `Descuento: $${descuento.toLocaleString()}`;
  card.querySelector('.card-total').innerText = `Total: $${total.toLocaleString()}`;

  return { subtotal, descuento, total };
}







