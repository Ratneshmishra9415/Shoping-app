const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const {validateProduct,isLoggedIn, isSeller, isProductAuthor} =  require('../middleware');
const Review = require('../models/review');



router.get('/products',async (req,res)=>{
   try{
    let products = await Product.find({});
   res.render('products/index',{products})
   }
   catch(e){
    res.status(500).render('error' , {err:e.message});
}
})

router.get('/products/new',isLoggedIn,isSeller,(req,res)=>{
    try{
        res.render('products/new')
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

router.post('/products',isLoggedIn,isSeller, validateProduct, async (req,res)=>{
    try{
        let {name , img , price , desc} = req.body;
    await Product.create({name , img , price , desc,author:req.user._id})
    req.flash('success' , 'Product added successfully');
    res.redirect('/products')
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

router.get('/products/:id',isLoggedIn,async (req,res)=>{
    try{
        let {id} = req.params;
      let foundProduct = await Product.findById(id).populate('reviews');
      //console.log(foundProduct)
      res.render('products/show', {foundProduct});
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

router.get('/products/:id/edit',isLoggedIn,isSeller, async (req,res)=>{
    try{
        let {id} = req.params;
    let foundProduct = await Product.findById(id);
    res.render('products/edit',{foundProduct})
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

router.patch('/products/:id',isLoggedIn,isSeller,isProductAuthor, validateProduct, async (req,res)=>{
   try{
    let {id} = req.params;
    let {name , img , price , desc} = req.body;
    await Product.findByIdAndUpdate(id, {name , img , price , desc})
    req.flash('success' , 'Product edited successfully');
    res.redirect('/products')
   }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})

router.delete('/products/:id',isLoggedIn,isProductAuthor ,isSeller, async(req,res)=>{
    try{
        let {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect('/products')
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
})


module.exports = router;