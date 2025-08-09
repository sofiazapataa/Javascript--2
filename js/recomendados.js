function getCarrito() { // inica leyendo el contenido del carrito que guardamos en LS
  return JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
}
function setCarrito(carrito) { //lo pasa a texto y guarda en LS
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
function imagenParaCarrito(ruta) {
  // adaptamos la llamada a las imagenes desde todas las pages
  if (!ruta) return ruta;
  if (ruta.startsWith("../")) return ruta;
  if (ruta.startsWith("./")) return ruta.replace("./", "../");
  if (ruta.startsWith("medios/")) return `../${ruta}`;
  return ruta;
}
function ajustarImagenParaMostrarEnIndex(ruta) {
  // adaptamos las imagenes para el index
  if (ruta && ruta.startsWith("../")) return ruta.replace("../", "./");
  return ruta;
}
function agregarItemAlCarritoDesdeProducto(prod) {
  let carrito = getCarrito(); //llamamos al carrito actual
  const key = String(prod.id).trim(); //convierte el ID en texto y le quita espacios
  const idx = carrito.findIndex(p => String(p.id).trim() === key); //buscamos si el producto ya esta en el carrito

  if (idx >= 0) {
    carrito[idx].cantidad = (carrito[idx].cantidad || 1) + 1; //Si ya existe, úsala. Si no existe, empieza en 1 y luego suma la cantidad.

  } else { //sino lo agrega en el carrito
    carrito.push({
      id: key,
      nombre: prod.nombre,
      precio: prod.precio,
      imagen: imagenParaCarrito(prod.imagen),
      cantidad: 1
    });
  }

  carrito = dedupeCarrito(carrito); //devolvemos el nuevo carrito
  setCarrito(carrito);
  actualizarNumeritoHeader();

  // Toastify (si está cargado)  
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
}
// ---------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  setCarrito(dedupeCarrito(getCarrito())); // actualizamos carrito
  actualizarNumeritoHeader();
});

// Accedemos al formulario y a los botones
const formulario = document.getElementById("cuestionario");
const botonGuardar = document.getElementById("guardarRutina");
const botonVer = document.getElementById("verRutina");
const lista = document.getElementById("lista-recomendados");
const resumen = document.getElementById("resumen"); // div donde se muestran los datos
const btnVolver = document.getElementById("btnVolver"); // botón volver

// Capturamos los datos del formulario (sin mostrar ni guardar)
let ultimaRutina = null;
// memoria de la lista actual de recomendados para el handler delegado
let productosRecos = []; 

// Escuchamos el envío del formulario
formulario.addEventListener("submit", function (e) {
  e.preventDefault(); //evitamos que el formulario se recargue

  // Obtener valores del formulario
  const tipoDePiel = document.getElementById("tipoDePiel").value.toLowerCase();
  const problema = document.getElementById("problema").value;
  const edad = document.getElementById("edad").value;
  const frecuencia = document.getElementById("frecuencia").value;

  // Guardamos los datos
  ultimaRutina = {  // objeto con propiedades, guardamos la ultima rutina cargada. 
    tipoDePiel,
    problema,
    edad,
    frecuencia
  };

  // OCULTAMOS el formulario, para las recomendaciones en cards
  formulario.style.display = "none";

  mostrarDatos(ultimaRutina);
  obtenerProductosRecomendados(tipoDePiel);

  // mostrar botón Volver
  if (btnVolver) btnVolver.style.display = "inline-block";
});

// mostrar resultado de los datos que puso el usuario
function mostrarDatos(datos) {
  // mostrar la card (estaba oculta)
  const resultadoWrap = document.getElementById("resultado");
  if (resultadoWrap) resultadoWrap.style.display = "block";

  const l = document.getElementById("resumen-lista");
  const titulo = document.querySelector(".resumen-titulo");
  if (titulo) titulo.textContent = "¡Listo! Acá están tus recomendaciones ✨";
//mostramos los datos que puso el usuario
  if (l) {
    l.innerHTML = `
      <li><strong>Tipo de piel:</strong> ${datos.tipoDePiel}</li>
      <li><strong>Problema:</strong> ${datos.problema}</li>
      <li><strong>Edad:</strong> ${datos.edad}</li>
      <li><strong>Frecuencia:</strong> ${datos.frecuencia}</li>
    `;
  }
}
// Cargar y filtrar productos
function obtenerProductosRecomendados(tipoDePiel) {
  // pedimos los productos del archivo
  fetch("json/productos.json")
    .then(res => res.json())
    .then(productos => productos.filter(p => p.tipos.includes(tipoDePiel))) //filtramos productos recomendados por tipo de piel
    
    .then(mostrarRecomendados)
    .catch(err => console.error("Error al cargar productos:", err)); 
}


// Mostrar los productos recomendados como cards
function mostrarRecomendados(productos) {
  const contenedor = document.getElementById("lista-recomendados");
  contenedor.innerHTML = "";

  // mostrar el título de la sección
  const tituloRecos = document.getElementById("titulo-recos");
  if (tituloRecos) tituloRecos.style.display = "block";

  let total = 0; //total 0 para sumar luego

  productos.forEach(producto => { //creamos la card de los productos recomendados
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${ajustarImagenParaMostrarEnIndex(producto.imagen)}" alt="${producto.nombre}" width="150" height="150">
      <h3>${producto.nombre}</h3>
      <p>Precio: $${producto.precio}</p>
      <small>Para piel: ${producto.tipos.join(", ")}</small>
      <button class="btn-agregar-reco" data-id="${producto.id}">Agregar al carrito</button>
    `;
    contenedor.appendChild(card);
    total += producto.precio;
  });

  // guardamos la lista actual 
  productosRecos = productos; 

  if (!contenedor.dataset.listener) { 
    contenedor.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-agregar-reco"); //busca el producto en la lista productosRecos usando el id que tiene el botón.
      if (!btn) return; //Si no se encontró botón, sale de la función y no hace nada.
      const id = btn.dataset.id;
      const prod = productosRecos.find(p => String(p.id) === String(id));//aseguramos de que se agregue una sola vez aunque la función se ejecute varias veces.
      if (prod) agregarItemAlCarritoDesdeProducto(prod); // dispara Toastify cada vez
    });
    contenedor.dataset.listener = "true";
  }

  // Total como card separada y centrada
  const totalWrap = document.getElementById("total-recos");
  totalWrap.innerHTML = "";
  if (productos.length > 0) {
    const totalCard = document.createElement("div");
    totalCard.className = "card total-card";
    totalCard.innerHTML = `<strong>Total: $${total}</strong>`;
    totalWrap.appendChild(totalCard);
  } else {
    contenedor.innerHTML = "<p>No hay productos recomendados para ese tipo de piel 😕</p>";
  }
}

// Guardar rutina en localStorage
botonGuardar.addEventListener("click", function () {
  if (!ultimaRutina) return alert("Primero completá el formulario");
  const rutinasGuardadas = JSON.parse(localStorage.getItem("rutinasGuardadas")) || [];
  rutinasGuardadas.push(ultimaRutina);
  localStorage.setItem("rutinasGuardadas", JSON.stringify(rutinasGuardadas));
  alert("Rutina guardada con éxito");
});

// Ver rutina guardada desde localStorage
botonVer.addEventListener("click", function () {
  const rutinasGuardadas = JSON.parse(localStorage.getItem("rutinasGuardadas")) || [];
  if (!rutinasGuardadas.length) {
    resumen.innerHTML = "";
    alert("No hay ninguna rutina guardada");
    return;
  }
  //creamos la card de la rutina guardada
  resumen.innerHTML = "";
  rutinasGuardadas.forEach((rutina, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h4>Rutina ${index + 1}</h4>
      <p>Tipo de piel: ${rutina.tipoDePiel}</p>
      <p>Problema: ${rutina.problema}</p>
      <p>Edad: ${rutina.edad}</p>
      <p>Frecuencia: ${rutina.frecuencia}</p>
      <button class="eliminar-rutina" data-index="${index}">Eliminar</button>
    `;
    resumen.appendChild(card);
  });
  //boton eliminar rutina guardada
  document.querySelectorAll(".eliminar-rutina").forEach(boton => {
    boton.addEventListener("click", function () {
      const i = Number(this.getAttribute("data-index"));
      const arr = JSON.parse(localStorage.getItem("rutinasGuardadas")) || [];
      arr.splice(i, 1);
      localStorage.setItem("rutinasGuardadas", JSON.stringify(arr));

      if (arr.length === 0) {
        resumen.innerHTML = "";
        alert("Se eliminaron todas las rutinas guardadas.");
        return;
      }
      botonVer.click();
    });
  });
});

/* Botón VOLVER */
if (btnVolver) {
  btnVolver.addEventListener("click", () => {
    formulario.style.display = "block";
    const resultado = document.getElementById("resultado");
    const tituloRecos = document.getElementById("titulo-recos");
    if (resultado) resultado.style.display = "none";
    if (tituloRecos) tituloRecos.style.display = "none";
    lista.innerHTML = "";
    document.getElementById("total-recos").innerHTML = "";
    resumen.innerHTML = "";
    btnVolver.style.display = "none";
    ultimaRutina = null;
  });
}
