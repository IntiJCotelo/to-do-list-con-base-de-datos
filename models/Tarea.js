const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TareaSchema = new Schema({
    texto: String,
});

module.exports = mongoose.model('Tarea', TareaSchema)