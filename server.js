import express from "express";
const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
    res.status(200).json("Backend connected");
   });

app.listen(PORT, () => {
  console.log("Server running");
});