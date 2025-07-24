const cuestionario = document.getElementById("cuestionario"); //accedemos al formulario
const botonGuardar = document.getElementById("guardarRutina");
const botonVer = document.getElementById("verRutina");


const productos = [
  { nombre: "Limpiador facial suave", tipos: ["seca", "sensible"], precio: 5800 },
  { nombre: "Limpiador facial purificante", tipos: ["grasa", "mixta", "acné"], precio: 5750 },
  { nombre: "Tonico hidratante", tipos: ["seca", "sensible", "arrugas"], precio: 4700 },
  { nombre: "Serum vitamina C toque glow", tipos: ["sensible", "seca", "manchas"], precio: 5400 },
  { nombre: "Serum vitamina C toque mate", tipos: ["grasa", "mixta", "enrojecimiento"], precio: 5450 },
  { nombre: "Crema hidratante ligera", tipos: ["grasa", "mixta"], precio: 6100 },
  { nombre: "Crema nutritiva", tipos: ["seca", "manchas"], precio: 6130 },
  { nombre: "Protector solar FPS 50, efecto hidratante", tipos: ["seca", "enrojecimiento"], precio: 7300 },
  { nombre: "Protector solar FPS 50, efecto seco", tipos: ["grasa", "mixta"], precio: 7320 }
];

// Mostrar datos del usuario
function mostrarRutina(datos){
  document.getElementById("mensajeFinal").textContent = "Gracias por completar el cuestionario 💖";
  document.getElementById("datoPiel").textContent = "Tipo de piel: " + datos.tipoDePiel;
  document.getElementById("datoProblema").textContent = "Problema: " + datos.problema;
  document.getElementById("datoEdad").textContent = "Edad: " + datos.edad;
  document.getElementById("datoFrecuencia").textContent = "Frecuencia de rutina: " + datos.frecuencia;


const lista = document.getElementById("listaProductos");
while (lista.firstChild) { //aca El while repite, para que se limpie la lista, sino los productos se acumularían uno debajo del otro.
    lista.removeChild(lista.firstChild);
}

// Filtrar productos según tipo de piel
const rutina = productos.filter(producto => producto.tipos.includes(datos.tipoDePiel));
// Agregar productos a la lista
rutina.forEach(producto => {
    const item = document.createElement("li"); //creamos un elemento en html pero no se agrega
   item.textContent = `${producto.nombre} - $${producto.precio}`;
    lista.appendChild(item); //appendChild: agregar un elemento dentro de otro en el html.
});

// Calcular y mostrar el total
const total = rutina.reduce((suma,producto) => suma + producto.precio, 0);
document.getElementById("totalRutina").textContent = `Total: $${total}`;
}
// Capturamos los datos del formulario (sin mostrar ni guardar aún)
let ultimaRutina = null;

cuestionario.addEventListener("submit", function (e) { //escuchamos el evento, cuando el usuario toque enviar se ejecuta la funcion
  e.preventDefault();  //escuchamos el evento, cuando el usuario toque enviar se ejecuta la funcion
  
//leemos lo que escribio el usuario en cada id  
// Obtener valores del formulario
const tipoDePiel = document.getElementById("tipoDePiel").value;
const problema = document.getElementById("problema").value;
const frecuencia = document.getElementById("frecuencia").value;
const edad = document.getElementById("edad").value;


ultimaRutina = { tipoDePiel, problema, edad, frecuencia };
mostrarRutina(ultimaRutina); // solo se muestra, NO se guarda
});

// 👉 Guardar rutina en localStorage solo si el usuario hace clic
botonGuardar.addEventListener("click", function () {
  if (ultimaRutina) {
    localStorage.setItem("rutinaGuardada", JSON.stringify(ultimaRutina));
    alert("Rutina guardada con éxito 🧴");
  } else {
    alert("Primero completá el formulario.");
  }
});

// 👉 Ver rutina guardada cuando el usuario lo decida
botonVer.addEventListener("click", function () {
  const datosGuardados = JSON.parse(localStorage.getItem("rutinaGuardada"));
  if (!datosGuardados) {
    alert("No hay ninguna rutina guardada.");
    return;
  }

  mostrarRutina(datosGuardados);
});


