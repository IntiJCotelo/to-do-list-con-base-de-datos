const input = document.querySelector("#input");
const btnAgregar = document.querySelector("#boton-agregar");
const h3 = document.querySelector("h3");
const ul = document.querySelector("ul");

async function agregarTarea() {
  if (input.value.length <= 0) {
    h3.innerText = "";
    h3.innerText = "Por favor, escribe una tarea";
    return;
  }

  h3.innerText = "";
  let tarea = input.value;
  tarea = tarea.charAt(0).toUpperCase() + tarea.slice(1);

  await fetch("http://localhost:3000/tareas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ texto: tarea }),
  })
  
  input.value = "";
  mostrarTareas();
}

async function mostrarTareas() {
  const respuesta = await fetch("http://localhost:3000/tareas");
  const tareas = await respuesta.json();
  tareas.forEach((tarea) => {
  tarea.editando = false;                                 //Tuve que hacer una función aparte para actualizar el display porque el forEach hace
  });                                                     //que la propiedad editando siempre sea falsa
  
  actualizarDisplay(tareas, ul);
}

function actualizarDisplay(arr, ul) {
  ul.innerHTML = "";
  let editando = arr.some((tarea) => tarea.editando);

  arr.forEach((tarea) => {
    const li = document.createElement("li");
    li.textContent = tarea.texto;
    li.style.marginBottom = "20px";

    if (tarea.editando) {
      li.innerHTML = "";
      const input = document.createElement("input");
      input.value = tarea.texto;
      li.appendChild(input);

      const btnGuardar = document.createElement("button");
      btnGuardar.textContent = "Guardar";
      btnGuardar.style.marginLeft = "10px";
      btnGuardar.addEventListener("click", () => {
        tarea.editando = false;
        editarTarea(tarea._id, input);
      });
      li.appendChild(btnGuardar);
    } else {
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.style.marginLeft = "10px";
      btnEditar.disabled = editando;
      btnEditar.addEventListener("click", () => {
        tarea.editando = true;
        actualizarDisplay(arr, ul);
      });
      li.appendChild(btnEditar);

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.style.marginLeft = "10px";
      btnEliminar.addEventListener("click", () => {
        eliminarTarea(tarea._id);
      });
      li.appendChild(btnEliminar);
    }

    ul.appendChild(li);
  });
}

async function editarTarea(id, input) {
  await fetch(`http://localhost:3000/tareas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ texto: input.value.charAt(0).toUpperCase() + input.value.slice(1) }),
  });
  mostrarTareas();
}

async function eliminarTarea(id) {
  await fetch(`http://localhost:3000/tareas/${id}`, {
    method: "DELETE",
  });
  mostrarTareas();
}

async function mostrarDatos(id) {
  const respuesta = await fetch(`http://localhost:3000/tareas/${id}`);
  const tarea = await respuesta.json();
  return tarea;
}

btnAgregar.addEventListener("click", () => {
  agregarTarea();
});

mostrarTareas();