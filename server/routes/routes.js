const controllers = require("../controllers/deletion/controller.js");
const userController = require("../controllers/users/userController.js");
const jwt = require("jsonwebtoken");

/*let verifyUser = function (req, res, next) {
  console.log("Midd 1");
  userController.findUser(req.body, res);
  console.log("Rta:");
  next();
};*/

async function verifyUser(req, res, next) {
  let user = req.query.user;
  let password = req.query.password;
  console.log("Starting...");
  let userExist = await userController.findUseByEmailAndPassword(
    user,
    password
  );
  if (userExist) {
    console.log("userExist rta:", userExist);
  }

  next();
}

function verifyUser1(req, res, next) {
  console.log("starting....");
  if (req.query.user && req.query.password) {
    // previous middleware found a user
    console.log("continue..");
  } else {
    console.log("stop...");
  }
  next();
}

module.exports = function (app) {
  app.delete("/firestore/", controllers.delete);
  app.get("/firestore/", controllers.findAll);
  app.post("/authenticate", (req, res) => {
    const test = controllers.findAll;
    if (req.body.user === "asfo" && req.body.password === "helloworld") {
      const payload = {
        check: true,
      };
      const token = jwt.sign(payload, app.get("key"), {
        expiresIn: 1440,
      });
      res.json({
        mensaje: "Autenticación correcta",
        token: token,
      });
    } else {
      res.json({ mensaje: "Usuario o contraseña incorrectos" });
    }
  });

  app.post("/createUser/", userController.create);
  app.get("/findUserUser/", userController.findUser);
  //app.use(userController.userExist);
  app.get("/login/", verifyUser, userController.login);
};
