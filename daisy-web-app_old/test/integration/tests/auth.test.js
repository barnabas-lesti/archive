const jwt = require('jsonwebtoken');
const { JSDOM } = require('jsdom');

const envConfig = require('../../../env.config');
const { User } = require('../../../src/server/models');
const { http, readEmailFile, createFakeUser } = require('../utils');

const existingUser = createFakeUser();
const notExistingUser = createFakeUser();

describe('auth', () => {
  beforeAll(async () => {
    await User.create({
      ...existingUser,
      passwordHash: await User.hashPassword(existingUser.password),
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/send-registration-email', () => {
    test('should respond with 403 if registration is disabled', async () => {
      const originalEnvValue = envConfig.AUTH_REGISTRATION_DISABLED;
      envConfig.AUTH_REGISTRATION_DISABLED = true;
      try {
        await http.post('/api/auth/send-registration-email', {});
      } catch (error) {
        expect(error.response.status).toBe(403);
      }
      envConfig.AUTH_REGISTRATION_DISABLED = originalEnvValue;
    });

    test('should respond with 400 if "email" is not provided', async () => {
      try {
        const { nickname, password } = notExistingUser;
        await http.post('/api/auth/send-registration-email', { nickname, password });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 400 if "password" is not provided', async () => {
      try {
        const { email, nickname } = notExistingUser;
        await http.post('/api/auth/send-registration-email', { email, nickname });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 400 if "nickname" is not provided', async () => {
      try {
        const { email, password } = notExistingUser;
        await http.post('/api/auth/send-registration-email', { email, password });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 409 if "email" is already registered', async () => {
      try {
        const { email, password, nickname } = notExistingUser;
        await http.post('/api/auth/send-registration-email', { email, password, nickname });
      } catch (error) {
        expect(error.response.status).toBe(409);
      }
    });

    test('should respond with 200 and send a Registration email to the given "email"', async () => {
      const { status } = await http.post('/api/auth/send-registration-email', { ...notExistingUser });
      const content = await readEmailFile(notExistingUser.email, 'registration', 'en');
      expect(status).toBe(200);
      expect(content).toBeDefined();
    });
  });

  describe('POST /api/auth/register', () => {
    test('should respond with 403 if registration is disabled', async () => {
      const originalEnvValue = envConfig.AUTH_REGISTRATION_DISABLED;
      envConfig.AUTH_REGISTRATION_DISABLED = true;
      try {
        await http.post('/api/auth/register', {});
      } catch (error) {
        expect(error.response.status).toBe(403);
      }
      envConfig.AUTH_REGISTRATION_DISABLED = originalEnvValue;
    });

    test('should respond with 400 if "token" is not provided', async () => {
      try {
        await http.post('/api/auth/register', {});
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 401 if "token" is invalid', async () => {
      try {
        const { email } = notExistingUser;
        const token = await jwt.sign({ email }, 'invalidSecret1234');
        await http.post('/api/auth/register', { token });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 400 if "token" does not contain the "email"', async () => {
      try {
        const { nickname, password } = notExistingUser;
        const token = await User.createRegistrationToken({ password, nickname });
        await http.post('/api/auth/register', { token });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 400 if "token" does not contain the "password"', async () => {
      try {
        const { email, nickname } = notExistingUser;
        const token = await User.createRegistrationToken({ email, nickname });
        await http.post('/api/auth/register', { token });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 400 if "token" does not contain the "nickname"', async () => {
      try {
        const { email, password } = notExistingUser;
        const token = await User.createRegistrationToken({ email, password });
        await http.post('/api/auth/register', { token });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 409 if the "email" is already registered', async () => {
      try {
        const token = await User.createRegistrationToken(existingUser);
        await http.post('/api/auth/register', { token });
      } catch (error) {
        expect(error.response.status).toBe(409);
      }
    });

    test('should respond with 200 register a new user and return it without the "passwordHash"', async () => {
      const token = await User.createRegistrationToken(notExistingUser);
      const { status, data } = await http.post('/api/auth/register', { token });
      const createdUser = await User.findOne({ email: notExistingUser.email });
      expect(status).toBe(200);
      expect(createdUser).not.toBeNull();
      expect(data).toBeDefined();
      expect(data.passwordHash).not.toBeDefined();
    });
  });

  describe('POST /api/auth/sign-in', () => {
    test('should respond with 400 if "email" is not provided', async () => {
      try {
        await http.post('/api/auth/sign-in', { password: existingUser.password });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 400 if "password" is not provided', async () => {
      try {
        await http.post('/api/auth/sign-in', { email: existingUser.email });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 401 if user was not found', async () => {
      try {
        const { email, password } = notExistingUser;
        await http.post('/api/auth/sign-in', { email, password });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 401 if "password" is invalid', async () => {
      try {
        await http.post('/api/auth/sign-in', { email: existingUser.email, password: 'notValid1234' });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 200, send the "user" and "accessToken" in the response', async () => {
      const { email, password } = existingUser;
      const { status, data: { user, accessToken } } = await http.post('/api/auth/sign-in', { email, password });
      expect(status).toBe(200);
      expect(user).toBeDefined();
      expect(accessToken).toBeDefined();
    });
  });

  describe('POST /api/auth/verify-access-token', () => {
    test('should respond with 400 if "token" is not provided', async () => {
      try {
        await http.post('/api/auth/verify-access-token', {});
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 401 if "token" is invalid', async () => {
      try {
        const token = await jwt.sign({ email: existingUser.email }, 'invalidSecret1234');
        await http.post('/api/auth/verify-access-token', { token });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 401 if user was not found', async () => {
      try {
        const token = await User.createAccessToken({ email: notExistingUser.email });
        await http.post('/api/auth/verify-access-token', { token });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 200 if "token" is valid and return the user', async () => {
      const token = await User.createAccessToken(existingUser);
      const { status, data } = await http.post('/api/auth/verify-access-token', { token });
      expect(status).toBe(200);
      expect(data).toBeDefined();
    });
  });

  describe('POST /api/auth/send-password-reset-email', () => {
    test('should respond with 400 if "email" is not provided', async () => {
      try {
        await http.post('/api/auth/send-password-reset-email', {});
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 404 if user with given "email" is not registered', async () => {
      try {
        await http.post('/api/auth/send-password-reset-email', { email: notExistingUser.email });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should respond with 200 and send a Password reset email to the given "email"', async () => {
      const { status } = await http.post('/api/auth/send-password-reset-email', { email: existingUser.email });
      const content = await readEmailFile(existingUser.email, 'passwordReset', 'en');
      expect(status).toBe(200);
      expect(content).toBeDefined();
    });
  });

  describe('PATCH /api/auth/password', () => {
    test('should respond with 400 if "token" is not provided', async () => {
      try {
        await http.patch('/api/auth/password', { password: 'newPassword1234' });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 400 if "password" is not provided', async () => {
      try {
        await http.patch('/api/auth/password', { token: 'yupThisIsAValidToken' });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 401 if "token" is invalid', async () => {
      try {
        const token = await jwt.sign({ email: existingUser.email }, 'invalidSecret1234');
        await http.patch('/api/auth/password', { password: 'newPassword1234', token });
      } catch (error) {
        expect(error.response.status).toBe(401);
      }
    });

    test('should respond with 400 if "token" does not contain the "email"', async () => {
      try {
        const token = await User.createPasswordResetToken({});
        await http.patch('/api/auth/password', { password: 'newPassword1234', token });
      } catch (error) {
        expect(error.response.status).toBe(400);
      }
    });

    test('should respond with 404 if user with given "email" is not registered', async () => {
      try {
        const token = await User.createPasswordResetToken({ email: notExistingUser.email });
        await http.patch('/api/auth/password', { password: 'newPassword1234', token });
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should respond with 200 and update the users password', async () => {
      const newPassword = 'newPassword1234';
      const token = await User.createPasswordResetToken({ email: existingUser.email });
      const { status } = await http.patch('/api/auth/password', { password: newPassword, token });
      const updatedUser = await User.findOne({ email: existingUser.email });
      expect(status).toBe(200);
      expect(await User.comparePasswords(existingUser.password, updatedUser.passwordHash)).toBe(false);
      expect(await User.comparePasswords(newPassword, updatedUser.passwordHash)).toBe(true);
    });
  });

  describe('Registration email', () => {
    test('should be in english if no "locale" was provided', async () => {
      await http.post('/api/auth/send-registration-email', { ...notExistingUser });
      const content = await readEmailFile(notExistingUser.email, 'registration', 'en');
      const { window: { document } } = new JSDOM(content);
      expect(document.querySelector('html').getAttribute('lang')).toMatch('en');
    });

    test('should be in the language that was requested with the "locale"', async () => {
      const locale = 'hu';
      await http.post('/api/auth/send-registration-email', { ...notExistingUser, locale });
      const content = await readEmailFile(notExistingUser.email, 'registration', locale);
      const { window: { document } } = new JSDOM(content);
      expect(document.querySelector('html').getAttribute('lang')).toMatch('hu');
    });

    test('should contain a link pointing to the token decorated registration page', async () => {
      await http.post('/api/auth/send-registration-email', { ...notExistingUser });
      const content = await readEmailFile(notExistingUser.email, 'registration', 'en');
      const { window: { document } } = new JSDOM(content);
      const linkElement = document.querySelector('a[data-registration-link]');
      expect(linkElement).not.toBeNull();
      expect(linkElement.getAttribute('href')).toMatch(/register\?token=?/g);
    });
  });

  describe('Password reset email', () => {
    test('should be in english if no "locale" was provided', async () => {
      await http.post('/api/auth/send-password-reset-email', { ...existingUser });
      const content = await readEmailFile(existingUser.email, 'passwordReset', 'en');
      const { window: { document } } = new JSDOM(content);
      expect(document.querySelector('html').getAttribute('lang')).toMatch('en');
    });

    test('should be in the language that was requested with the "locale"', async () => {
      const locale = 'hu';
      await http.post('/api/auth/send-password-reset-email', { ...existingUser, locale });
      const content = await readEmailFile(existingUser.email, 'passwordReset', locale);
      const { window: { document } } = new JSDOM(content);
      expect(document.querySelector('html').getAttribute('lang')).toMatch('hu');
    });

    test('should contain a link pointing to the token decorated password reset page', async () => {
      await http.post('/api/auth/send-password-reset-email', { ...existingUser });
      const content = await readEmailFile(existingUser.email, 'passwordReset', 'en');
      const { window: { document } } = new JSDOM(content);
      const linkElement = document.querySelector('a[data-password-reset-link]');
      expect(linkElement).not.toBeNull();
      expect(linkElement.getAttribute('href')).toMatch(/reset-password\?token=?/g);
    });
  });
});
