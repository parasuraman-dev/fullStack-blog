module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {//is Authenticated is a defalut method of passport.js
      return next();
    }
    res.redirect("/auth/login");
  },
};
