/* ============================================
   SCRIPT PRINCIPAL DE LA TIENDA
   ============================================
   Hasta ahora este archivo hace:
   1) Dibuja los productos en la grilla.
   2) Filtra por categoría (pastillas del menú).
   3) Filtra por texto (buscador).
   4) Carrito: agregar, sumar/restar, eliminar,
      vaciar y calcular el total.
   5) Abre y cierra el panel del carrito.

   Lo que falta: pedir los datos del cliente y
   generar el mensaje de WhatsApp (próximo paso).
   ============================================ */

// Guardan cuál es el filtro activo en cada momento
let categoriaActual = 'todos';
let terminoBusqueda = '';

// El carrito: un array de objetos { id, nombre, precio, cantidad }
let carrito = [];

document.addEventListener('DOMContentLoaded', () => {
  aplicarFiltros();
  activarPillsDeCategoria();
  activarBuscador();
  activarCarritoDrawer();
  activarBotonesDeCarrito();
  activarControlesDelCarrito();
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
   Categorías: al hacer clic, guarda la categoría
   elegida y vuelve a filtrar la grilla
   ---------------------------------------------- */
function activarPillsDeCategoria() {
  const pills = document.querySelectorAll('.category-pill');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      categoriaActual = pill.dataset.category;
      aplicarFiltros();
    });
  });
}

/* ----------------------------------------------
   Buscador: filtra a medida que el cliente escribe
   ---------------------------------------------- */
function activarBuscador() {
  const input = document.getElementById('search-input');

  input.addEventListener('input', () => {
    terminoBusqueda = input.value.trim().toLowerCase();
    aplicarFiltros();
  });
}

/* ----------------------------------------------
   Combina el filtro de categoría + el de búsqueda
   y vuelve a dibujar la grilla con el resultado.
   Se llama cada vez que cambia alguno de los dos.
   ---------------------------------------------- */
function aplicarFiltros() {
  let resultado = productos;

  if (categoriaActual !== 'todos') {
    resultado = resultado.filter(producto => producto.categoria === categoriaActual);
  }

  if (terminoBusqueda !== '') {
    resultado = resultado.filter(producto =>
      producto.nombre.toLowerCase().includes(terminoBusqueda)
    );
  }

  renderizarProductos(resultado);
}

/* ----------------------------------------------
   Abrir / cerrar el panel del carrito
   ---------------------------------------------- */
function activarCarritoDrawer() {
  const cartToggle = document.getElementById('cart-toggle');
  const cartClose = document.getElementById('cart-close');
  const cartOverlay = document.getElementById('cart-overlay');
  const clearCartButton = document.getElementById('clear-cart');

  cartToggle.addEventListener('click', abrirCarrito);
  cartClose.addEventListener('click', cerrarCarrito);
  cartOverlay.addEventListener('click', cerrarCarrito);
  clearCartButton.addEventListener('click', vaciarCarrito);
}

function abrirCarrito() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('visible');
}

function cerrarCarrito() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('visible');
}

/* ----------------------------------------------
   Escucha los clics en "Agregar al carrito" de
   cualquier tarjeta de producto (delegación de
   eventos: un solo listener en la grilla en vez
   de uno por cada botón)
   ---------------------------------------------- */
function activarBotonesDeCarrito() {
  const grid = document.getElementById('product-grid');

  grid.addEventListener('click', evento => {
    const boton = evento.target.closest('.add-to-cart-button');
    if (!boton || boton.disabled) return;

    const id = Number(boton.dataset.id);
    agregarAlCarrito(id);
    abrirCarrito();
  });
}

/* ----------------------------------------------
   Agrega un producto al carrito. Si ya estaba,
   simplemente le suma 1 a la cantidad.
   ---------------------------------------------- */
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const itemExistente = carrito.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  renderizarCarrito();
}

/* ----------------------------------------------
   Suma o resta 1 a la cantidad de un producto del
   carrito. Si llega a 0, se elimina directamente.
   ---------------------------------------------- */
function cambiarCantidad(id, delta) {
  const item = carrito.find(item => item.id === id);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }

  renderizarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  renderizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  renderizarCarrito();
}

/* ----------------------------------------------
   Vuelve a dibujar el contenido del panel del
   carrito: la lista de productos, el total y el
   contador del ícono del header. Se llama cada
   vez que el carrito cambia.
   ---------------------------------------------- */
function renderizarCarrito() {
  const contenedor = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-button');

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="cart-empty">Todavía no agregaste productos.</p>';
    totalEl.textContent = formatearPrecio(0);
    checkoutButton.disabled = true;
    actualizarContadorCarrito();
    return;
  }

  contenedor.innerHTML = '';

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;

    const fila = document.createElement('div');
    fila.className = 'cart-item';
    fila.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.nombre}</span>
        <span class="cart-item-price">${formatearPrecio(item.precio)} c/u</span>
      </div>
      <div class="cart-item-controls">
        <div class="qty-stepper">
          <button class="qty-button" data-action="restar" data-id="${item.id}" aria-label="Restar">−</button>
          <span class="qty-value">${item.cantidad}</span>
          <button class="qty-button" data-action="sumar" data-id="${item.id}" aria-label="Sumar">+</button>
        </div>
        <span class="cart-item-subtotal">${formatearPrecio(subtotal)}</span>
        <button class="cart-item-remove" data-action="eliminar" data-id="${item.id}" aria-label="Eliminar producto">&times;</button>
      </div>
    `;

    contenedor.appendChild(fila);
  });

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  totalEl.textContent = formatearPrecio(total);
  checkoutButton.disabled = false;

  actualizarContadorCarrito();
}

/* ----------------------------------------------
   Actualiza el numerito rojo sobre el ícono del
   carrito, con la cantidad total de unidades
   ---------------------------------------------- */
function actualizarContadorCarrito() {
  const contador = document.getElementById('cart-count');
  const totalUnidades = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  contador.textContent = totalUnidades;
}

/* ----------------------------------------------
   Escucha los clics dentro del panel del carrito
   (sumar, restar, eliminar) usando delegación de
   eventos, igual que con "Agregar al carrito"
   ---------------------------------------------- */
function activarControlesDelCarrito() {
  const contenedor = document.getElementById('cart-items');

  contenedor.addEventListener('click', evento => {
    const boton = evento.target.closest('button[data-action]');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    const accion = boton.dataset.action;

    if (accion === 'sumar') cambiarCantidad(id, 1);
    if (accion === 'restar') cambiarCantidad(id, -1);
    if (accion === 'eliminar') eliminarDelCarrito(id);
  });
}