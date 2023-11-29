const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const initSocket = require("./socket/index");

const app = express();
const PORT = process.env.PORT || 4000;

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const authMiddleware = require("./middleware/authMiddleware");

const corsOptions = {
    // connect to frontend
    // origin: ["https://mern-chat-l99i.onrender.com", "http://localhost:5173"],
    origin: "https://mern-chat-l99i.onrender.com",
    allowHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"], 
    credentials: true, 
    methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Users
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connected"))
    .catch(err => console.log("DB Connection Error" + err.message));

app.post("/", authMiddleware);

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// init socket w/ server & corsOptions
initSocket(server, corsOptions);
