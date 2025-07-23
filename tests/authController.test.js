
const authController = require('../src/controllers/authController');
const User = require('../src/models/user');
const logger = require('../src/utils/logger');
const { signupSchema } = require('../src/validators/user');

jest.mock('../src/models/user');
jest.mock('../src/utils/logger');
jest.mock('../src/validators/user', () => ({
  signupSchema: { validate: jest.fn() },
}));

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe('authController.register', () => {
  afterEach(() => jest.clearAllMocks());

  test('returns 400 if validation fails', async () => {
    const req = { body: {} };
    const res = createMockRes();
    signupSchema.validate.mockReturnValue({ error: { details: [{ message: 'Validation error' }] } });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
    expect(logger.warn).toHaveBeenCalledWith('Validation error');
  });

});