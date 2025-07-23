const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  author: { type: String, required: true, trim: true, maxlength: 50 },
  isbn: { type: String, required: true, unique: true },
  genre: { type: String, required: true, trim: true },
  publishedYear: { type: Number, required: true },
  pages: { type: Number, required: true, min: 1 },
  description: { type: String, maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);