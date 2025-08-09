// --- MODO OSCURO ---
(function () { // esta funcion se ejecuta sola inmediatamente al cargarse el script 
  const temaGuardado = localStorage.getItem("tema"); //buscamos que tema se guardo
  const oscuroPorDefecto = window.matchMedia("(prefers-color-scheme: dark)").matches; //vemos si el usuario tiene configurado modo oscuro por defecto.(true o false)
  document.documentElement.classList.toggle("dark-mode", temaGuardado === "dark" || (!temaGuardado && oscuroPorDefecto));//Activa o desactiva la clase dark-mode en la etiqueta <html> 
})();

document.addEventListener("DOMContentLoaded", () => { //Espera a que el DOM esté listo
  const btnModoOscuro = document.getElementById("btnModoOscuro");
  if (!btnModoOscuro) return;

  function updateLabel() { //actualiza el texto del botón para que diga la opción que se aplicará si tocas el boton.
  btnModoOscuro.textContent = document.documentElement.classList.contains("dark-mode") 
    ? "Modo Claro" 
    : "Modo Oscuro";
}
updateLabel();

//Cuando clickeás el botón guarda la preferencia y actualiza el texto del botón para que siempre sea coherente.
btnModoOscuro.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark-mode");
  localStorage.setItem("tema", document.documentElement.classList.contains("dark-mode") ? "dark" : "light");
  updateLabel();
});
});
