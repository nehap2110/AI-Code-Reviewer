const {reviewCode}  = require('../services/ai.service.js');

const review =  async(req,res)=>{
    try {

        console.log("review api hit");

        const {code} = req.body;

        if(!code){
            return res.status(400).json({
                success:false,
                message:"code is required"
            });
        }

        const result =await reviewCode(code);

        res.json({
            success:true,
            review : result
        });
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success:false,
            message:"something went wrong"
        });
    }
}

module.exports = {review}