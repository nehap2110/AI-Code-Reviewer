const express = require("express");
const cors = require("cors");

const healthRoutes= require('./routes/healthRoutes.js');
const ReviewRoutes  = require('./routes/review.routes.js');
require("dotenv").config();


const app =express();
app.use(cors());
app.use(express.json());


app.use("/api/health",healthRoutes);
app.use("/api/review",ReviewRoutes);




const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});