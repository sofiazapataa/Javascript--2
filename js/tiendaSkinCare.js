//accedemos al formulario y los botones
const cuestionario = document.getElementById("cuestionario"); //Busca un elemento por su ID en el html, Y lo guarda en una variable de JavaScript llamada formulario.
const botonVer = document.getElementById("verRutina");
const botonGuardar = document.getElementById("guardarRutina");

//array de objetos de todos los datos
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

//mostrar resultado de los datos que puso el usuario
function mostrarRutina(datos){
    document.getElementById("mensajeFinal").textContent = "gracias por completar el cuestionario"
    document.getElementById("datoPiel").textContent = "tu tipo de piel es: " + datos.tipoDePiel;
    document.getElementById("datoProblema").textContent = "tu problema es: " + datos.problema;
    document.getElementById("datoEdad").textContent = "edad: " + datos.edad;
    document.getElementById("datoFrecuencia").textContent = "frecuencia: " + datos.frecuencia;
}

// Capturamos los datos del formulario (sin mostrar ni guardar aún)
let ultimaRutina = null;

//escuchamos el evento, cuando el usuario toque enviar se ejecuta la funcion
cuestionario.addEventListener("submit", function (evt){
    evt.preventDefault(); //evitamos que el formulario se recargue

    //leemos lo que escribió el usuario en cada id  
    // Obtener valores del formulario
    const tipoDePiel = document.getElementById("tipoDePiel").value;
    const problema = document.getElementById("problema").value;
    const edad = document.getElementById("edad").value;
    const frecuencia = document.getElementById("frecuencia").value;

    ultimaRutina = { //objeto con propiedades, guardamos la ultima rutina cargada. 
      tipoDePiel: tipoDePiel,
      problema: problema,
      edad: edad,
      frecuencia: frecuencia
    };

    mostrarRutina(ultimaRutina); //llamamos a la funcion y mostramos la ultima rutina cargada. 

    // este método sirve para limpiar la lista antes de volver a mostrar productos nuevos
    const lista = document.getElementById("listaProductos");
    while(lista.firstChild){ //aca El while repite, para que se limpie la lista, sino los productos se acumularían uno debajo del otro.
        lista.removeChild(lista.firstChild);
    }
    //Porque .firstChild no borra, solo te muestra qué hay primero.
    // Y .removeChild() necesita saber qué tiene que borrar.

    // Filtrar productos según tipo de piel
    const rutina = productos.filter(producto => producto.tipos.includes(ultimaRutina.tipoDePiel));

    // Agregar productos a la rutina indicada
    rutina.forEach(producto =>{
        const item = document.createElement("li"); //creamos un elemento en html pero no se agrega
        item.textContent = `${producto.nombre} - $${producto.precio}`; 
        lista.appendChild(item); //appendChild: agregar un elemento dentro de otro en el html.
    });

    // Calcular y mostrar el total
    const total = rutina.reduce((suma, producto) => suma + producto.precio, 0);
    document.getElementById("totalRutina").textContent = `total: $${total}`;
})

// se guarda la rutina en localStorage solo si el usuario hace click en el boton guardar rutina
botonGuardar.addEventListener("click", function (){
    if(ultimaRutina){ 
        // la rutina se guarda en la memoria del navegador (localStorage), con el nombre 'rutinaGuardada'
        localStorage.setItem("rutinaGuardada", JSON.stringify(ultimaRutina)); //Como localStorage solo guarda texto, convierto la rutina en texto con JSON.stringify.
        alert("rutina guardada con exito");
    }else {
        alert("primero completa el formulario");
    }
});

// se ve la rutina guardada cuando el usuario hace click en ver rutina
botonVer.addEventListener("click", function (){
    const datosGuardados = JSON.parse(localStorage.getItem("rutinaGuardada"));
    //Busco la rutina que guardé antes en el navegador, la convierto de texto a objeto, y la guardo en una caja nueva que se llama datosGuardados
    if(!datosGuardados){
        alert("no hay ninguna rutina guardada");
        return;
    }
    mostrarRutina(datosGuardados);
});
