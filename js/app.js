// Tablero de Hábitos - app.js
// --- Referencias al DOM ---
const form = document.getElementById("form-habito");
const inputHabito = document.getElementById("input-habito");
const listaHabitos = document.getElementById("lista-habitos");
const contadorHabitos = document.getElementById("contador-habitos");
const mensajeVacio = document.getElementById("mensaje-vacio");
const btnLimpiar = document.getElementById("btn-limpiar");

const CLAVE_STORAGE = "tablero-habitos:datos";

// --- Modelo de datos ---
// habitos: Array<{ id: number, nombre: string, completado: boolean }>
let habitos = cargarHabitos();

// --- Funciones auxiliares (arrow functions + destructuring) ---

// Genera un id simple basado en timestamp
const generarId = () => Date.now();

// Crea un nuevo objeto hábito
const crearHabito = (nombre) => ({
  id: generarId(),
  nombre: nombre.trim(),
  completado: false,
});

// Recupera los hábitos guardados en localStorage
function cargarHabitos() {
  try {
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  } catch (error) {
    console.error("No se pudieron cargar los hábitos:", error);
    return [];
  }
}

// Guarda el arreglo actual de hábitos en localStorage
const guardarHabitos = () => {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(habitos));
};

// Alterna el estado completado/pendiente de un hábito por id
const alternarCompletado = (id) => {
  habitos = habitos.map((habito) => {
    const { id: idHabito, completado } = habito;
    return idHabito === id ? { ...habito, completado: !completado } : habito;
  });
};

// Elimina un hábito por id
const eliminarHabito = (id) => {
  habitos = habitos.filter(({ id: idHabito }) => idHabito !== id);
};

// Elimina todos los hábitos ya completados
const eliminarCompletados = () => {
  habitos = habitos.filter(({ completado }) => !completado);
};

// --- Renderizado dinámico (sin HTML hardcodeado) ---
function renderizarHabitos() {
  // Limpiar lista actual
  listaHabitos.innerHTML = "";

  // Mostrar/ocultar mensaje de lista vacía
  mensajeVacio.classList.toggle("d-none", habitos.length > 0);

  habitos.forEach(({ id, nombre, completado }) => {
    const item = document.createElement("li");
    item.className = `list-group-item habito-item ${
      completado ? "completado" : "pendiente"
    }`;
    item.dataset.id = id;

    item.innerHTML = `
      <span class="habito-nombre" data-accion="completar">${escaparHTML(nombre)}</span>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary btn-eliminar"
        data-accion="eliminar"
        aria-label="Eliminar hábito"
      >
        &times;
      </button>
    `;

    listaHabitos.appendChild(item);
  });

  actualizarContador();
  guardarHabitos();
}

// Evitar inyección de HTML al mostrar el nombre del hábito
function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// Actualiza el texto del contador de hábitos
function actualizarContador() {
  const total = habitos.length;
  const completados = habitos.filter(({ completado }) => completado).length;
  contadorHabitos.textContent =
    total === 0
      ? "0 hábitos"
      : `${completados}/${total} completados`;
}

// --- Manejo del formulario para agregar hábitos ---
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = inputHabito.value;
  if (!nombre.trim()) return;

  habitos.push(crearHabito(nombre));
  inputHabito.value = "";
  inputHabito.focus();

  renderizarHabitos();
});

// --- Delegación de eventos: un único listener en el <ul> padre ---
listaHabitos.addEventListener("click", (evento) => {
  const item = evento.target.closest(".habito-item");
  if (!item) return;

  const { id } = item.dataset;
  const idHabito = Number(id);
  const { accion } = evento.target.dataset;

  if (accion === "eliminar") {
    eliminarHabito(idHabito);
    renderizarHabitos();
  } else if (accion === "completar") {
    alternarCompletado(idHabito);
    renderizarHabitos();
  }
});

// --- Botón para limpiar hábitos completados ---
btnLimpiar.addEventListener("click", () => {
  eliminarCompletados();
  renderizarHabitos();
});

// --- Render inicial al cargar la página ---
renderizarHabitos();