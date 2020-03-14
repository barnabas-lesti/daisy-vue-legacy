module.exports = {
  public: [
    require('./auth/profile'),
    require('./auth/profile/password'),
    require('./auth/register'),
    require('./auth/sign-in'),
    require('./auth/verify'),
  ],
  private: [
    require('./diet/foods'),
    require('./diet/recipes'),
    require('./diary'),
  ],
};
