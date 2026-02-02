module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'danish4@wattmonk.com',
        defaultReplyTo: 'danish786.asp@gmail.com',
      },
    },
  },

  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});