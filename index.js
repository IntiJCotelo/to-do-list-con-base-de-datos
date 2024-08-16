const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const Tarea = require("./models/Tarea");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

mongoose
  .connect("mongodb://127.0.0.1:27017/lista-tareas")
  .then(() => {
    console.log("Conectado con exito a la base de datos");
  })
  .catch((err) => {
    console.log("No se pudo conectar con la base de datos");
    console.log(err);
  });

app.post("/tareas", async (req, res) => {
  const { texto } = req.body;

  const nuevaTarea = new Tarea({
    texto,
  });

  await nuevaTarea.save();

  res.json({
    ok: true,
    message: "Tarea guardada",
    nuevaTarea,
  });
});

app.get("/tareas", async (req, res) => {
  const tareas = await Tarea.find();
  res.json(tareas);
});

app.delete("/tareas/:id", async (req, res) => {
  const { id } = req.params;
  await Tarea.findByIdAndDelete(id);
  res.json({
    ok: true,
    message: "Tarea eliminada",
  });
});

app.put("/tareas/:id", async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;
  await Tarea.findByIdAndUpdate(id, { texto });
  res.json({
    ok: true,
    message: "Tarea actualizada",
  });
});

app.get("/tareas/:id", async (req, res) => {
  const { id } = req.params;
  const tarea = await Tarea.findById(id);
  res.json(tarea);
});

app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
