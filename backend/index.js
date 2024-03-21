const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const productRoutes =  require("./routes/productRoutes");
//const eventRoutes = require("./routes/events.routes");
const mongodbConnection = require("./config/mongodb.config");
const errorHandlerMiddleware = require("./middleware/error.middleware");
const authMiddleware = require("./middleware/auth.middleware");

mongodbConnection();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use("/", authRoutes);
app.use("/", productRoutes);

app.use(errorHandlerMiddleware);
app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`);
});
