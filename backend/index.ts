import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes)
app.get("/", (req, res)=> {
    res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Try to connect to database, but don't fail if it doesn't work
connectDB()
    .then(() => {
        console.log("Database Connected");
    })
    .catch((error) => {
        console.log(
            "Database connection failed, but server will still start: ",
            error
        );
    });

// Start server regardless of database connection
server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
    
