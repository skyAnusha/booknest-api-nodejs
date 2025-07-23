// JavaScript

const bookController = require('../src/controllers/bookController');
const Book = require('../src/models/book');
const logger = require('../src/utils/logger');
const { bookSchema, updateBookSchema } = require('../src/validators/book');

jest.mock('../src/models/book');
jest.mock('../src/utils/logger');
jest.mock('../src/validators/book', () => ({
  bookSchema: { validate: jest.fn() },
  updateBookSchema: { validate: jest.fn() },
}));

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe('bookController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('createBook', () => {
    test('returns 400 if validation fails', async () => {
      const req = { body: {}, user: { _id: 'user123' } };
      const res = createMockRes();

      bookSchema.validate.mockReturnValue({ error: { details: [{ message: 'Validation error' }] } });

      await bookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
      expect(logger.warn).toHaveBeenCalled();
    });

    test('returns 500 if user is missing', async () => {
      const req = { body: {}, user: null };
      const res = createMockRes();

      bookSchema.validate.mockReturnValue({ error: null });

      await bookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: expect.stringContaining('User info required') });
      expect(logger.error).toHaveBeenCalled();
    });

    test('creates and returns book if valid', async () => {
      const req = { body: { title: 'Test Book' }, user: { _id: 'user123' } };
      const res = createMockRes();

      bookSchema.validate.mockReturnValue({ error: null });

      const mockSave = jest.fn().mockResolvedValue({ _id: 'book123' });
      Book.mockImplementation(() => ({
        ...req.body,
        addedBy: req.user._id,
        save: mockSave,
        toObject: () => req.body,
      }));

      await bookController.createBook(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(logger.info).toHaveBeenCalled();
    });

    test('handles save errors', async () => {
      const req = { body: { title: 'Test Book' }, user: { _id: 'user123' } };
      const res = createMockRes();

      bookSchema.validate.mockReturnValue({ error: null });

      Book.mockImplementation(() => ({
        ...req.body,
        addedBy: req.user._id,
        toObject: () => req.body,
        save: jest.fn().mockRejectedValue(new Error('DB error')),
      }));

      await bookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getBooks', () => {
    test('returns all books', async () => {
      const req = {};
      const res = createMockRes();
      Book.find.mockResolvedValue([{ title: 'A' }, { title: 'B' }]);

      await bookController.getBooks(req, res);

      expect(res.json).toHaveBeenCalledWith([{ title: 'A' }, { title: 'B' }]);
      expect(logger.info).toHaveBeenCalled();
    });

    test('handles DB error', async () => {
      const req = {};
      const res = createMockRes();
      Book.find.mockRejectedValue(new Error('DB fail'));

      await bookController.getBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB fail' });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    test('returns 400 if validation fails', async () => {
      const req = { body: {}, params: { id: 'book123' } };
      const res = createMockRes();

      updateBookSchema.validate.mockReturnValue({ error: { details: [{ message: 'Invalid data' }] } });

      await bookController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
      expect(logger.warn).toHaveBeenCalled();
    });

    test('returns 404 if book not found', async () => {
      const req = { body: { title: 'New' }, params: { id: 'book123' } };
      const res = createMockRes();

      updateBookSchema.validate.mockReturnValue({ error: null });
      Book.findByIdAndUpdate.mockResolvedValue(null);

      await bookController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
      expect(logger.warn).toHaveBeenCalled();
    });

    test('updates book and returns it', async () => {
      const req = { body: { title: 'Updated' }, params: { id: 'book123' } };
      const res = createMockRes();

      updateBookSchema.validate.mockReturnValue({ error: null });
      Book.findByIdAndUpdate.mockResolvedValue({ _id: 'book123', title: 'Updated' });

      await bookController.updateBook(req, res);

      expect(res.json).toHaveBeenCalledWith({ _id: 'book123', title: 'Updated' });
      expect(logger.info).toHaveBeenCalled();
    });

    test('handles DB error', async () => {
      const req = { body: {}, params: { id: 'book123' } };
      const res = createMockRes();

      updateBookSchema.validate.mockReturnValue({ error: null });
      Book.findByIdAndUpdate.mockRejectedValue(new Error('Update fail'));

      await bookController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Update fail' });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('deleteBook', () => {
    test('deletes book and returns success message', async () => {
      const req = { params: { id: 'book123' } };
      const res = createMockRes();
      Book.findByIdAndDelete.mockResolvedValue({ _id: 'book123' });

      await bookController.deleteBook(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'Book deleted' });
      expect(logger.info).toHaveBeenCalled();
    });

    test('returns 404 if book not found', async () => {
      const req = { params: { id: 'book123' } };
      const res = createMockRes();
      Book.findByIdAndDelete.mockResolvedValue(null);

      await bookController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
      expect(logger.warn).toHaveBeenCalled();
    });

    test('handles DB error', async () => {
      const req = { params: { id: 'book123' } };
      const res = createMockRes();
      Book.findByIdAndDelete.mockRejectedValue(new Error('Delete fail'));

      await bookController.deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Delete fail' });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});