const userController = require("../controllers/userController");

module.exports = (app) => {
  app
    .route("/login")
    .post(userController.userLogin);

  app
    .route("/register")
    .post(userController.userRegister);

  app
    .route("/logout")
    .get(userController.userLogout);

  app
    .route("/user")
    .get(userController.getUser);
};
