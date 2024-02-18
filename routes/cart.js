const express = require("express");
const { isLoggedIn } = require("../middleware");
const User = require("../models/User");
const Product = require("../models/Product");
const stripe = require("stripe")('sk_test_51OdqbzSHC82BOHa5USdxxg8KaTtsvJoXKbld7VuqYwMFbPzcRz5hOmNmhgCZ4BnoTa9zUTveHl69xOnJVAH041V000vXcszu7c')

const router = express.Router();

router.get("/user/cart", isLoggedIn, async (req, res) => {
  let userId = req.user._id;
  //console.log(userId)
  let user = await User.findById(userId).populate("cart");
  //   console.log(user, "sam");
  let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
  //   console.log(totalAmount);

  res.render("cart/cart", { user, totalAmount });
});

router.post("/user/:productId/add", isLoggedIn, async (req, res) => {
  let { productId } = req.params;
  let userId = req.user._id;
  let user = await User.findById(userId);
  //   console.log(user, "sam");
  let product = await Product.findById(productId);
  user.cart.push(product);
  await user.save();
  res.redirect("/user/cart");
});
router.get('/payment/:id', async(req,res)=>{
  let id = req.params.id;
  let data = await User.findById(id).populate('cart');
  let cart = [...data.cart]
  const session = await stripe.checkout.sessions.create({
    line_items: cart.map(item=>{
      return {
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price*100,
        },
        quantity: 1,
      }
    }), 
    
    
    mode: 'payment',
    success_url: 'http://localhost:8080/success',
    cancel_url: 'http://localhost:8080/cancel',
  });

  res.redirect(303, session.url);
})

router.post('/cart/:id/remove', isLoggedIn, async (req,res)=>{
  let userId = req.user._id;
  let user = await User.findById(userId);
  let prodId = req.body.prodId
  let data = user.cart;
  for(let i = 0; i<data.length; i++) {
    if(prodId == data[i]) {
      data.splice(i,1);
    }
  }
  user.save();


  res.redirect("/user/cart");
});

router.get('/success', (req,res)=>{
  res.render('products/success')
});



module.exports = router;