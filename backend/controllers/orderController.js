import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe'
import Razorpay from 'razorpay';


const currency = 'usd'
const deliveryCharge = 10

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_SECRET_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });
let razorpay;
if (process.env.RAZORPAY_SECRET_ID && process.env.RAZORPAY_SECRET_KEY) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_SECRET_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
} else {
  console.warn('Razorpay keys not found, Razorpay integration disabled.');
}



const placeOrder = async (req, res) => {
    try {
         const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User not authenticated" });
        }
        const {items, amount, address} = req.body
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        res.json({success: true, message: "Order Placed"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// Placing orders using stripe method

const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { items, amount, address } = req.body;
    const origin = req.headers.origin;

    // Save order to DB
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Build Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // converting to cents
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as an item
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: 10 * 100,
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });

    // DEBUG log: check if session.url is defined
    console.log('Stripe session created:', session.url);

        console.log('Full session object:', session);

    // Respond to frontend
    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error('Stripe order error:', error.message);  // Use .message for clarity
    res.json({ success: false, message: error.message });
  }
};

// Verify STripe

const verifyStripe = async(req , res) => {
    const userId = req.user?.id;
    const {orderId , success } = req.body;
    try{
        if (success === "true"){
            await orderModel.findByIdAndUpdate(orderId , {payment : true});
            await userModel.findByIdAndUpdate(userId , {cartData : {}})
            res.json({success : true});
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    }
    catch(error){
         console.log(error)
        res.json({success: false, message: error.message})
    }
}



// Place order using Razorpay payment
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    const { items, amount, address } = req.body;

    // Save order to DB with payment: false initially
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Create Razorpay order options
    const options = {
      amount: (amount + deliveryCharge) * 100, // amount in paise
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    const order = await razorpay.orders.create(options);

    // Return order details and key to frontend
    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_SECRET_ID,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("Razorpay order error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpay.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment successful" });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// All orders data for admin panel
const allOrders = async (req, res) => {
    try{
        const orders = await orderModel.find({})
        res.json({success: true, orders})
    }
    catch(error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Update order status
const updateStatus = async (req, res) => {
    try{
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order Status Updated"})
    }
    catch (error){
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {placeOrder, placeOrderRazorpay, verifyRazorpay, placeOrderStripe, verifyStripe ,  allOrders, updateStatus, userOrders}