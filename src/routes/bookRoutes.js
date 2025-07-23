// JavaScript
const express = require('express');
const verifyToken = require('../middlewares/auth');
const { createBook, getBooks, updateBook, deleteBook } = require('../controllers/bookController');

const router = express.Router();

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Book added
 */
router.post('/books', verifyToken, createBook);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: List all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Books returned
 */
router.get('/books', verifyToken, getBooks);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Edit a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book updated
 *       404:
 *         description: Book not found
 */
router.put('/books/:id', verifyToken, updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
router.delete('/books/:id', verifyToken, deleteBook);

module.exports = router;