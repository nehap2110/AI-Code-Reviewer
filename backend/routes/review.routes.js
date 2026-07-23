const express  = require( "express");
const {review}  = require( '../controllers/review.controller.js');

const router = express.Router();

router.post('/',review);

// router.post("/", (req, res) => {
//     console.log("Review route reached");
//     res.json({
//         success: true,
//         message: "Review route is working"
//     });
// });

module.exports =  router;