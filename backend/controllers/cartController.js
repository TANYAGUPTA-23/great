import userModel from "../models/userModel.js";


// add products to user cart
const addToCart = async (req, res) => {
    try{
        console.log('🔔 addToCart controller hit!');
        const userId = req.user.id;  
        const { itemId, size } = req.body;
          console.log('User ID:', userId);
        console.log('Item ID:', itemId);
        console.log('Size:', size);
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        await userModel.findByIdAndUpdate(userId, {cartData})
         const updatedUser = await userModel.findById(userId);
        console.log('Updated cartData:', updatedUser.cartData);
        res.json({success: true, message: "Product added to cart successfully"});
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message});
    }
}

//authenticates the user → validates request → fetches the user's cart → removes the specified product size → updates MongoDB → sends updated cart back to the frontend.

export const removeFromCart = async (req, res) => {
  try {
    console.log('removeFromCart called with:', req.body);
    const userId = req.user?.id;
    console.log('User ID:', userId);

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { itemId, size } = req.body;
    if (!itemId || !size) {
      return res.status(400).json({ success: false, message: "Missing itemId or size" });
    }

    const user = await userModel.findById(userId); // FIXED HERE
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.cartData) {
      return res.status(400).json({ success: false, message: "User cart is empty" });
    }

    const cartData = user.cartData;

    if (cartData[itemId] && cartData[itemId][size]) {
      delete cartData[itemId][size];  // Remove the specific size
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId]; // If no sizes left, remove the item entirely
      }

      await userModel.findByIdAndUpdate(userId, { cartData }); // save back the updated cart
      return res.json({ success: true, message: "Item removed", cartData });
    } else {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// update user cart
const updateCart = async (req, res) => {
    try{
        const userId = req.user.id;  
        const { itemId, size } = req.body;
        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity
        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message: "Cart updated successfully"});
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message});
    }
}

// get user cart
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id; // assuming userAuth middleware sets req.user
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}


export { addToCart, updateCart, getUserCart }