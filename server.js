require("dotenv").config();

const express = require("express");
const cors = require("cors");

//const connectDB = require("./config/db");

const chatRoutes = require("./routes/chatRoutes");
const imageRoutes = require("./routes/imageRoutes");
const webSearchRoutes = require("./routes/webSearchRoutes");

const app = express();
//connectDB();
app.use(cors());
app.use(express.json());

app.use("/", chatRoutes);
app.use("/", imageRoutes);
app.use("/", webSearchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Shero AI Backend Running on Port ${PORT}`);
});