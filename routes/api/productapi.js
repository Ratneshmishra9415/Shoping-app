const express = require("express");
const { isLoggedIn } = require("../../middleware");
const User = require("../../models/User");
const router = express.Router();

router.post('/products/:id/like',isLoggedIn,async (req,res)=>{
    let {id} = req.params;
    let user = req.user;
    let isLiked = user.wishlist.includes(id);
    if(isLiked) {
       await User.findByIdAndUpdate(req.user._id,{$pull: {wishlist : id}})
    }else{
       await User.findByIdAndUpdate(req.user._id,{$addToSet: {wishlist : id}})
    }
})


module.exports = router;