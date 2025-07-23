const express = require('express');
const { register, authenticate } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserSignup'
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Registration error
 */
router.post('/signup', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login as a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Login error
 */
router.post('/login', authenticate);