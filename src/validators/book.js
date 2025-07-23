// JavaS// JavaScript
const Joi = require('joi');

const bookSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  author: Joi.string().min(1).max(50).required(),
  isbn: Joi.string().pattern(/^[\d-]+$/).required(),
  genre: Joi.string().min(1).required(),
  publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  pages: Joi.number().integer().min(1).required(),
  description: Joi.string().max(500),
  price: Joi.number().min(0).required(),
});

const updateBookSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  author: Joi.string().min(1).max(50),
  isbn: Joi.string().pattern(/^[\d-]+$/),
  genre: Joi.string().min(1),
  publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()),
  pages: Joi.number().integer().min(1),
  description: Joi.string().max(500),
  price: Joi.number().min(0),
});

module.exports = { bookSchema, updateBookSchema };