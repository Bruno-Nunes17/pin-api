const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./src/routes/routes");

require("dotenv").config();

const app = express();
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.emit("ready");
  })
  .catch((e) => console.log(e));

app.use(
  helmet({
    contentSecurityPolicy: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.use(routes);

const port = process.env.PORT;
app.on("ready", () => {
  app.listen(port, () => {
    console.log(`Acessar http://localhost:${port}`);
    console.log(`Servidor executando na porta ${port}`);
  });
});
