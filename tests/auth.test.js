// JavaScript

const verifyToken = require('../src/middlewares/auth');
const User = require('../src/models/user');
const jwt = require('jsonwebtoken');
const logger = require('../src/utils/logger');


jest.mock('../src/models/user');
jest.mock('jsonwebtoken');
jest.mock('../src/utils/logger');

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe('verifyToken middleware', () => {
  afterEach(() => jest.clearAllMocks());

  test('returns 401 if authorization header is missing', async () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = jest.fn();

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(logger.warn).toHaveBeenCalledWith('No authorization header');
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 if token is invalid', async () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = createMockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(logger.error).toHaveBeenCalledWith('Token error: Invalid token');
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 401 if user not found', async () => {
    const req = { headers: { authorization: 'Bearer validtoken' } };
    const res = createMockRes();
    const next = jest.fn();
    User.findById = jest.fn();
    jwt.verify.mockReturnValue({ userId: 'user123' });
    User.findById.mockResolvedValue(null);

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(logger.warn).toHaveBeenCalledWith('User not found');
    expect(next).not.toHaveBeenCalled();
  });

});