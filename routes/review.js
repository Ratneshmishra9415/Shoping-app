const express =  require('express');
const Product = require('../models/Product');
const Review = require('../models/review');
const {validateReview , isLoggedIn} = require('../middleware')

const router = express.Router();

router.post('/products/:productId/review' , isLoggedIn , validateReview, async(req,res)=>{
        try{
                let {productId} = req.params;
                let {rating , comment} = req.body;
                const product = await Product.findById(productId);
                const review  = new Review({rating , comment});
                product.reviews.push(review); 
                
                await review.save();
                await product.save();
                req.flash('success' , 'Review added successfully');
                res.redirect(`/products/${productId}`)
        }
        catch(e){
                res.status(500).render('error' ,{err:e.message})
        }      
    
})



module.exports = router;