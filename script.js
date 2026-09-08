/* ============================================
   SCRIPT PRINCIPAL DE LA TIENDA
   ============================================
   Por ahora este archivo solo hace dos cosas:
   1) Dibuja los productos en la grilla.
   2) Abre y cierra el panel del carrito.

   El filtrado por categoría, el buscador y el
   carrito funcional los agregamos en los
   próximos pasos.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderizarProductos(productos);
  activarPillsDeCategoria();
  activarCarritoDrawer();
});

/* ----------------------------------------------
   Dibuja la grilla de productos a partir de una
   lista (por ahora siempre le pasamos "productos"
   completo, sin filtrar)
   ---------------------------------------------- */
function renderizarProductos(lista) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';

  if (lista.length === 0) {
    grid.innerHTML = '<p class="empty-state">No encontramos productos.</p>';
    return;
  }

  lista.forEach(producto => {
    grid.appendChild(crearTarjetaProducto(producto));
  });
}

/* ----------------------------------------------
   Crea la tarjeta (card) de un producto individual
   ---------------------------------------------- */
function crearTarjetaProducto(producto) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const infoStock = obtenerInfoStock(producto.stock);
  const agotado = producto.stock === 'agotado';

  card.innerHTML = `
    <div class="product-image">
      <img
        src="${producto.imagen}"
        alt="${producto.nombre}"
        onerror="this.replaceWith(crearPlaceholderImagen())"
      >
      <span class="stock-tag ${infoStock.clase}">${infoStock.texto}</span>
    </div>
    <div class="product-info">
      <span class="product-category">${producto.categoria}</span>
      <h3 class="product-name">${producto.nombre}</h3>
      <span class="product-price">${formatearPrecio(producto.precio)}</span>
      <button class="add-to-cart-button" data-id="${producto.id}" ${agotado ? 'disabled' : ''}>
        ${agotado ? 'Agotado' : 'Agregar al carrito'}
      </button>
    </div>
  `;

  return card;
}

/* ----------------------------------------------
   Si una imagen no existe todavía (porque no
   subiste la foto real a /images), se muestra
   este ícono en su lugar, para que la página no
   se vea rota.
   ---------------------------------------------- */
function crearPlaceholderImagen() {
  const placeholder = document.createElement('div');
  placeholder.className = 'product-image-placeholder';
  placeholder.innerHTML = `
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.4">
      <path d="M9 3h6l1 4H8l1-4Z"></path>
      <path d="M7 7h10l1 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L7 7Z"></path>
    </svg>
  `;
  return placeholder;
}

/* ----------------------------------------------
   Traduce el valor interno de stock ("disponible",
   "ultimas", "agotado") a texto + clase de CSS
   ---------------------------------------------- */
function obtenerInfoStock(estado) {
  switch (estado) {
    case 'disponible':
      return { texto: 'Disponible', clase: 'stock-disponible' };
    case 'ultimas':
      return { texto: 'Últimas unidades', clase: 'stock-ultimas' };
    case 'agotado':
      return { texto: 'Agotado', clase: 'stock-agotado' };
    default:
      return { texto: estado, clase: '' };
  }
}

/* ----------------------------------------------
   Formatea un número como precio en pesos
   Ej: 15990 -> "$15.990"
   ---------------------------------------------- */
function formatearPrecio(numero) {
  return '$' + numero.toLocaleString('es-AR');
}

/* ----------------------------------------------
   Categorías: por ahora solo marca visualmente
   cuál está seleccionada. El filtrado real de
   productos se agrega en el próximo paso.
   ---------------------------------------------- */
function activarPillsDeCategoria() {
  const pills = document.querySelectorAll('.category-pill');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

/* ----------------------------------------------
   Abrir / cerrar el panel del carrito
   ---------------------------------------------- */
function activarCarritoDrawer() {
  const cartToggle = document.getElementById('cart-toggle');
  const cartClose = document.getElementById('cart-close');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');

  function abrirCarrito() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('visible');
  }

  function cerrarCarrito() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('visible');
  }

  cartToggle.addEventListener('click', abrirCarrito);
  cartClose.addEventListener('click', cerrarCarrito);
  cartOverlay.addEventListener('click', cerrarCarrito);
}

