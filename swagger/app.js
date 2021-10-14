const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const csrf = require('csurf');
const flash = require("connect-flash");
const User = require("./models/user");
const multer = require("multer");
const MONGODB_URI = "mongodb://localhost:27017/binar_ch7";
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
// const csrfProtection = csrf();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/", authRoutes);

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("RUNNING ON PORT 2000");
    app.listen(2000);
  })
  .catch((err) => console.log(err));

//Extended
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Game API",
      description: "Game API Information",
      contact: {
        name: "Donny",
      },
      servers: ["http://locahost:2000"],
    },
  },
  apis: ["app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//
/**
 * @swagger
 * /game:
 *  get:
 *    description: Use to request all game
 *    responses:
 *      '200':
 *        description: A successful response
 * */

app.get("/game", (req, res) => {
  res.status(200).send("Game results");
});
