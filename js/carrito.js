function getCarrito() { // inica leyendo el contenido del carrito que guardamos en LS
  return JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
}
function setCarrito(c) { //lo pasa a texto y guarda en LS
  localStorage.setItem("productos-en-carrito", JSON.stringify(c));
}
function dedupeCarrito(carrito) { // no ponemos los duplicados del carrito
  return carrito.reduce((acc, prod) => {
    const existente = acc.find(item => item.id === prod.id);//Busca si ya hay un producto con el mismo id.
    if (existente) { //si ya existe suma la cantidad
      existente.cantidad += prod.cantidad || 1; 
    } else {
      acc.push({ ...prod }); //Si NO lo encontró, lo agrega, los 3 puntos sirven para copiar las caracteristicas, asi no cambiamos el original
    }
    return acc; //devuelve el acc final
  }, []);
}

// Dedupe inicial por si había duplicados guardados
let productosEnCarrito = dedupeCarrito(getCarrito());
setCarrito(productosEnCarrito);

//llamamos a todos los botones y acciones
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function actualizarNumeritoHeader() {
  const span = document.querySelector(".carrito span");
  if (!span) return; // si no lo encuentra se sale
  const c = getCarrito();
  span.textContent = c.length; //cuenta cuántos elementos distintos hay, no la suma de cantidades.
}

//armamos y mostramos el carrito
function cargarProductosCarrito(){
  productosEnCarrito = dedupeCarrito(getCarrito());
  setCarrito(productosEnCarrito); //cargamos los productos sin duplicar los que ya estaban

  if(productosEnCarrito.length > 0){
    contenedorCarritoVacio.classList.add("disabled"); //si hay productos ocultamos el mensaje
    contenedorCarritoProductos.classList.remove("disabled"); // Muestra el contenedor donde se listan los productos 
    contenedorCarritoAcciones.classList.remove("disabled"); // Muestra ej: botón de vaciar, pagar, etc.
    contenedorCarritoComprado.classList.add("disabled"); // Oculta la sección que se mostraría después de una compra finalizada 

    contenedorCarritoProductos.innerHTML = "";
// por cada producto en carrito crea un div
    productosEnCarrito.forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
        <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.nombre}">
        <div class="carrito-producto-titulo">
          <small>Título</small>
          <h3>${producto.nombre}</h3>
        </div>
        <div class="carrito-producto-cantidad">
          <small>Cantidad</small>
          <p>${producto.cantidad}</p>
        </div>
        <div class="carrito-producto-precio">
          <small>Precio</small>
          <p>$${producto.precio}</p>
        </div>
        <div class="carrito-producto-subtotal">
          <small>Subtotal</small>
          <p>$${producto.precio * producto.cantidad}</p>
        </div>
        <button class="carrito-producto-eliminar" data-id="${producto.id}" aria-label="Eliminar">🗑</button>
      `;
      contenedorCarritoProductos.append(div) //lo agregamos
    });

  } else { //Si no hay productos: Muestra el mensaje de “Carrito vacío”.Oculta la lista, las acciones y la sección de “Compra realizada”.
    contenedorCarritoVacio.classList.remove("disabled"); //lo muestra
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }
  actualizarBotonesEliminar();
  actualizarTotal();
  actualizarNumeritoHeader(); 
}
cargarProductosCarrito();

function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id; //id del producto que quiero eliminar
      let c = getCarrito(); //carrito actual
      const idx = c.findIndex(p => String(p.id).trim() === String(id).trim()); //Busca en qué posición del carrito está el producto que tiene el mismo id que el que se clickeó. 
      if (idx !== -1) {
        c.splice(idx, 1); //lo elimina si existe
        setCarrito(c); //guardamos carrito actualizado
        cargarProductosCarrito(); 
      }
    });
  });
}
//boton vaciar carrito
botonVaciar.addEventListener("click", () => {
  setCarrito([]);
  cargarProductosCarrito();
});
//funcion para actualizar el total
function actualizarTotal(){
  const c = getCarrito();
  const totalCalculado = c.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  contenedorTotal.textContent = `$${totalCalculado}`;
}
//boton comprar
if (botonComprar) {
  botonComprar.addEventListener("click", () => {
    const c = getCarrito();
    if (!c.length) return; //sale de la funcion si esta vacio
    setCarrito([]); //Vacía el carrito guardando un array vacío como nuevo contenido.
    contenedorCarritoProductos.innerHTML = "";  // vacia el carrito
    contenedorCarritoAcciones.classList.add("disabled"); //oculta las acciones
    contenedorCarritoVacio.classList.add("disabled"); //Oculta el mensaje de carrito vacío.
    contenedorCarritoComprado.classList.remove("disabled"); //confirma la compra
    actualizarTotal();
    actualizarNumeritoHeader(); //lo dejamos en 0 después de comprar

    // Notificación de compra
    if (window.Toastify) {
      Toastify({
        text: "🎉 ¡Gracias por tu compra!",
        duration: 4000,
        gravity: "top", // posición vertical
        position: "center", // posición horizontal
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: true
      }).showToast();
    }
  });
}