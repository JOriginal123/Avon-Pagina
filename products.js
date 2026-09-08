/* ============================================
   PRODUCTOS
   ============================================
   Este es el único archivo que necesitás tocar
   para agregar, quitar o modificar productos.

   Cada producto tiene:
   - id:        un número único (no repetir)
   - nombre:    el nombre que ve el cliente
   - categoria: tiene que coincidir EXACTO con
                alguna de las categorías del menú
                (Perfumes, Labiales, Maquillaje,
                Cuidado personal, Cocina, Otros)
   - precio:    solo el número, sin puntos ni $
   - stock:     "disponible" | "ultimas" | "agotado"
   - imagen:    ruta a la foto dentro de /images
                (si la imagen no existe, se muestra
                un ícono genérico automáticamente)
   ============================================ */

const productos = [
  {
    id: 1,
    nombre: "Perfume Far Away",
    categoria: "Perfumes",
    precio: 15990,
    stock: "disponible",
    imagen: "images/perfume-far-away.jpg"
  },
  {
    id: 2,
    nombre: "Perfume Little Black Dress",
    categoria: "Perfumes",
    precio: 14500,
    stock: "ultimas",
    imagen: "images/perfume-lbd.jpg"
  },
  {
    id: 3,
    nombre: "Labial Ultra Color Mate",
    categoria: "Labiales",
    precio: 3200,
    stock: "disponible",
    imagen: "images/labial-ultracolor.jpg"
  },
  {
    id: 4,
    nombre: "Máscara de pestañas Super Extender",
    categoria: "Maquillaje",
    precio: 4100,
    stock: "disponible",
    imagen: "images/mascara-superextender.jpg"
  },
  {
    id: 5,
    nombre: "Crema hidratante Renew",
    categoria: "Cuidado personal",
    precio: 6800,
    stock: "agotado",
    imagen: "images/crema-renew.jpg"
  },
  {
    id: 6,
    nombre: "Set de sartenes antiadherentes",
    categoria: "Cocina",
    precio: 22000,
    stock: "ultimas",
    imagen: "images/set-sartenes.jpg"
  },
  {
    id: 7,
    nombre: "Desodorante roll-on Naturals",
    categoria: "Cuidado personal",
    precio: 2100,
    stock: "disponible",
    imagen: "images/desodorante-naturals.jpg"
  },
  {
    id: 8,
    nombre: "Bolso organizador de cartera",
    categoria: "Otros",
    precio: 5300,
    stock: "disponible",
    imagen: "images/bolso-organizador.jpg"
  }
];