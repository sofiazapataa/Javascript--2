function getCarrito() { // inica leyendo el contenido del carrito que guardamos en LS
  return JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
}
function setCarrito(carrito) { //lo pasa a texto y lo guarda en LS
  localStorage.setItem("productos-en-carrito", JSON.stringify(carrito));
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
function actualizarNumeritoHeader() {
  const span = document.querySelector(".carrito span");
  if (!span) return; // si no lo encuentra se sale
  const c = getCarrito();
  span.textContent = c.length; //cuenta cuántos elementos distintos hay, no la suma de cantidades.
}
function agregarAlCarritoPorId(id, productosFuente) { 
  const prod = productosFuente.find(p => p.id == id); //Buscamos el producto en el catalogo
  if (!prod) return false; // si no lo encontramos devuelve falso

  //Traemos el carrito actual de LS
  let carrito = getCarrito();

  // vemos si ya existe en el carrito
  const i = carrito.findIndex(item => item.id == prod.id);

  // Sumo cantidad o agrego nuevo
  if (i !== -1) {
    carrito[i].cantidad = (carrito[i].cantidad || 1) + 1;
  } else {
    carrito.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      imagen: prod.imagen,
      cantidad: 1
    });
  }

  // Limpio duplicados, guardo y actualizo numerito
  carrito = dedupeCarrito(carrito);
  setCarrito(carrito);
  actualizarNumeritoHeader();

  // notificacion Toast del producto agregado 
  if (window.Toastify) {
    Toastify({
      text: `${prod.nombre} agregado al carrito 🛒`,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      stopOnFocus: true,
    }).showToast();
  }

  return true;
}

// ---------------------------------------

let productos = []; // variable global

document.addEventListener("DOMContentLoaded", () => {
  setCarrito(dedupeCarrito(getCarrito())); //actualizamos carrito
  actualizarNumeritoHeader();

  const contenedor = document.getElementById("cards-container");
  if (!contenedor) {
    console.info("no hay productos en esta página.");
    return;
  }

  fetch("/json/productos.json") //cargamos los productos
    .then(res => {
      return res.json();//convierte la respuesta del JSON del fetch en un objeto, para luego guardar los productos
    })
    .then(data => { //guardamos los datos en productos
       productos = data;
      
      productos.forEach(p => {
        const card = document.createElement("div"); //creamos las cards y las ponemos en el contenedor
        card.classList.add("card");
        card.innerHTML = `
          <img src="${p.imagen}" alt="${p.nombre}" width="200" height="200">
          <h3>${p.nombre}</h3>
          <p>Precio: $${p.precio}</p>
          <small>Para piel: ${p.tipos.join(", ")}</small>
          <button class="producto-agregar" data-id="${p.id}">Agregar al carrito</button>
        `;
        contenedor.appendChild(card);
      });

      // un solo listener para todos los botones
      contenedor.addEventListener("click", (e) => {
        const btn = e.target.closest(".producto-agregar");
        if (!btn) return;
        const id = btn.dataset.id; // identifica qué producto se quiere agregar al carrito.
        const ok = agregarAlCarritoPorId(id, productos); //Llama a agregarAlCarritoPorId, pasándole el id y la lista de productos.
        if (!ok) console.warn("No se pudo agregar al carrito, id:", id); //si no lo reconoce por id salta error
      });
    })
    .catch(err => console.error("Error al cargar productos:", err)); //si falla algo en fetch salta aca
});
