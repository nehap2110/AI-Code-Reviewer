const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app =express();
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
  res.json({
    success:true,
    message :"AI code reviewer Baxckend Running"
  })
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server  running on ${PORT}`)
});