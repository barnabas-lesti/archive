const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { Mail, logger } = require('../utils');

const envConfig = require('../../../env.config');

module.exports = (router) => {
  router.route('/auth/send-registration-email')
    .post(async (req, res) => {
      if (envConfig.AUTH_REGISTRATION_DISABLED) return res.sendStatus(403);

      const { email, password, nickname, locale = 'en' } = req.body;
      if (!email || !password || !nickname) return res.sendStatus(400);

      const expiresInMinutes = envConfig.AUTH_EMAIL_TOKEN_EXPIRATION_IN_MINUTES;
      try {
        const token = await User.createRegistrationToken({ email, password, nickname });
        const link = encodeURI(`${envConfig.BASE_URL}/${locale}/register?token=${token}`);
        try {
          const verificationMail = new Mail(email, locale, Mail.Templates.REGISTRATION, { link, expiresInMinutes });
          await verificationMail.send();
          return res.sendStatus(200);
        } catch (mailError) {
          return res.sendStatus(400);
        }
      } catch (unknownError) {
        logger.error(unknownError);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/register')
    .post(async (req, res) => {
      if (envConfig.AUTH_REGISTRATION_DISABLED) return res.sendStatus(403);

      const { token } = req.body;
      if (!token) return res.sendStatus(400);

      let email, nickname, password;
      try {
        ({ email, nickname, password } = await jwt.verify(token, envConfig.AUTH_SECRET));
      } catch (jwtError) {
        return res.sendStatus(401);
      }

      if (!email || !password || !nickname) return res.sendStatus(400);

      let passwordHash = await User.hashPassword(password);
      try {
        const doc = await User.create({ email, passwordHash, nickname });
        let user;
        ({ passwordHash, ...user } = doc.toObject());
        return res.send(user);
      } catch (ex) {
        if (ex.code === 11000) return res.sendStatus(409);

        logger.error(ex);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/sign-in')
    .post(async (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) return res.sendStatus(400);

      try {
        const userDoc = await User.findOne({ email });
        if (userDoc) {
          if (await User.comparePasswords(password, userDoc.passwordHash)) {
            const { passwordHash, ...user } = userDoc.toObject();
            const accessToken = await User.createAccessToken(user);
            return res.send({ user, accessToken });
          }
        }
        return res.sendStatus(401);
      } catch (unknownError) {
        logger.error(unknownError);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/verify-access-token')
    .post(async (req, res) => {
      const { token } = req.body;
      if (!token) return res.sendStatus(400);

      let email;
      try {
        ({ email } = await jwt.verify(token, envConfig.AUTH_SECRET));
      } catch (jwtError) {
        return res.sendStatus(401);
      }

      try {
        const doc = await User.findOne({ email });
        if (!doc) return res.sendStatus(401);

        const { passwordHash, ...user } = doc.toObject();
        return res.send(user);
      } catch (unknownError) {
        logger.error(unknownError);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/send-password-reset-email')
    .post(async (req, res) => {
      const { email, locale = 'en' } = req.body;
      if (!email) return res.sendStatus(400);

      const user = await User.findOne({ email });
      if (!user) return res.sendStatus(404);

      const expiresInMinutes = envConfig.AUTH_EMAIL_TOKEN_EXPIRATION_IN_MINUTES;
      try {
        const token = await User.createPasswordResetToken({ email });
        const link = encodeURI(`${envConfig.BASE_URL}/${locale}/reset-password?token=${token}`);
        try {
          const passwordResetMail = new Mail(email, locale, Mail.Templates.PASSWORD_RESET, { link, expiresInMinutes });
          await passwordResetMail.send();
          return res.sendStatus(200);
        } catch (mailError) {
          return res.sendStatus(400);
        }
      } catch (unknownError) {
        logger.error(unknownError);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/password')
    .patch(async (req, res) => {
      const { token, password } = req.body;
      if (!token || !password) return res.sendStatus(400);

      let email;
      try {
        ({ email } = await jwt.verify(token, envConfig.AUTH_SECRET));
        if (!email) return res.sendStatus(400);
      } catch (jwtError) {
        return res.sendStatus(401);
      }

      const user = await User.findOne({ email });
      if (!user) return res.sendStatus(404);

      try {
        await User.findOneAndUpdate({ email }, { passwordHash: await User.hashPassword(password) });
        return res.sendStatus(200);
      } catch (unknownError) {
        logger.error(unknownError);
        return res.sendStatus(500);
      }
    });

  router.route('/auth/profile')
    .patch(async (req, res) => {
      const { user, body } = req;
      if (!user) return res.sendStatus(401);
      if (!body.nickname) return res.sendStatus(400);

      try {
        await User.findOneAndUpdate({ _id: user._id }, body);
        return res.sendStatus(200);
      } catch (unknownError) {
        logger.error(unknownError);
        return res.sendStatus(500);
      }
    });

  return router;
};
