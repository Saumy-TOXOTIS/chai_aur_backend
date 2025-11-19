import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({
    path: './.env'
});

connectDB()
.then(() => {
    app.on("error", (err) => {
        console.error("Server error:", err);
        process.exit(1);
    });
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});