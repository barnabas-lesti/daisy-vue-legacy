module.exports = {
  '400/alreadyExists' () {
    return cy
      .server()
      .route({ method: 'PUT', url: '/api/auth/register', status: 400, response: { error: 'ALREADY_EXISTS' } });
  },
  '200/ok' (user) {
    return cy
      .server()
      .route({ method: 'PUT', url: '/api/auth/register', status: 200, response: user });
  },
};
