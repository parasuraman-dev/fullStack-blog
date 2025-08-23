const LocalStrategy = require("passport-local").Strategy; // used for local authentication
const User = require("../models/User"); // user model
const bcrypt = require("bcryptjs"); // used for password hashing and verification
//! Passport Configuration
module.exports = (passport)=> {
  passport.use(
    new LocalStrategy(
      {
        // define the  local strategy for email and password authentication
        usernameField: "email",
      },
      async (email, password, done) => {
        // here done is a callback function that is in built in passport
        try {
          //? Find the user by email
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: "User not found with that Email",
            }); // return false if user not found
          }
          //? Compare the password(typed pw)  with the hashed password(user.password DB) in the database
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Password does not match" });
          }
          return done(null, user); // return the user if the password is correct
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  //? serialise the user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  //? deserialise the user - based on the user id stored in the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};