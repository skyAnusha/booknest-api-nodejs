// JavaScript
const Book = require('../models/book');
const { bookSchema, updateBookSchema } = require('../validators/book');
const logger = require('../utils/logger');

exports.createBook = async (req, res) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    logger.warn(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  if (!req.user || !req.user._id) {
    logger.error("Missing user info");
    return res.status(500).json({ message: "User info required" });
  }

  try {
    const book = new Book({ ...req.body, addedBy: req.user._id });
    await book.save();
    logger.info(`Book created: ${book._id}`);
    res.status(201).json(book);
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    logger.info(`Fetched ${books.length} books`);
    res.json(books);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const { error } = updateBookSchema.validate(req.body);
  if (error) {
    logger.warn(error.details[0].message);
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      logger.warn(`Book not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Book not found' });
    }
    logger.info(`Book updated: ${req.params.id}`);
    res.json(book);
  } catch (err) {
    logger.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      logger.warn(`Book not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Book not found' });
    }
    logger.info(`Book deleted: ${req.params.id}`);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: err.message });
  }
};