import dotenv from "dotenv";
import connectDB from "./src/db/db.js";
import { app } from "./app.js";

dotenv.config();

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection Failed:  ", err);
  });
