export default {
  'auth/profile': {
    'get/401/unauthorized' () {
      return cy.server()
        .route({ method: 'GET', url: '/api/auth/profile', status: 401, response: { error: 'UNAUTHORIZED' } });
    },
    'get/200/ok' (user) {
      return cy.server()
        .route({ method: 'GET', url: '/api/auth/profile', status: 200, response: user });
    },
    'patch/200/ok' (user) {
      return cy.server()
        .route({ method: 'PATCH', url: '/api/auth/profile', status: 200, response: user });
    },
  },
  'auth/profile/password': {
    'patch/401/invalidCredentials' () {
      return cy.server()
        .route({ method: 'PATCH', url: '/api/auth/profile/password', status: 401, response: { error: 'INVALID_CREDENTIALS' } });
    },
    'patch/200/ok' () {
      return cy.server()
        .route({ method: 'PATCH', url: '/api/auth/profile/password', status: 200, response: '' });
    },
  },

  'auth/register': {
    'put/400/alreadyExists' () {
      return cy.server()
        .route({ method: 'PUT', url: '/api/auth/register', status: 400, response: { error: 'ALREADY_EXISTS' } });
    },
    'put/200/ok' (user) {
      return cy.server()
        .route({ method: 'PUT', url: '/api/auth/register', status: 200, response: user });
    },
  },

  'auth/signIn': {
    'post/404/notFound' () {
      return cy.server()
        .route({ method: 'POST', url: '/api/auth/sign-in', status: 404, response: { error: 'NOT_FOUND' } });
    },
    'post/401/invalidCredentials' () {
      return cy.server()
        .route({ method: 'POST', url: '/api/auth/sign-in', status: 401, response: { error: 'INVALID_CREDENTIALS' } });
    },
    'post/200/ok' ({ user, authHeader }) {
      return cy.server()
        .route({ method: 'POST', url: '/api/auth/sign-in', status: 200, response: { user, authHeader } });
    },
  },
};
