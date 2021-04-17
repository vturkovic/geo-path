const express = require("express");
const path = require("path");
require("./db/mongoose");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/order");
const companyRouter = require("./routers/company");
const roleRouter = require("./routers/role");
const logRouter = require("./routers/log");
const routeRouter = require("./routers/route");
const orderCategory = require("./routers/order-category");

const app = express();
const port = process.env.PORT 

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(userRouter);
app.use(orderRouter);
app.use(companyRouter);
app.use(roleRouter);
app.use(logRouter);
app.use(routeRouter);
app.use(orderCategory);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

