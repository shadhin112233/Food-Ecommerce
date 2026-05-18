import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";


const placeOrder = async (req, res) => {
    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        const items = Array.isArray(req.body.items)
            ? req.body.items
            : [];

        if (!items.length) {
            return res.status(400).json({
                success: false,
                message: "No items provided"
            });
        }

        const amount = Number(req.body.amount);

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }

        const address = req.body.address;

        if (!address || typeof address !== "object") {
            return res.status(400).json({
                success: false,
                message: "Invalid address"
            });
        }

        const stripeKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeKey) {
            console.log("Missing STRIPE_SECRET_KEY");

            return res.status(500).json({
                success: false,
                message: "Stripe key missing"
            });
        }

        const stripe = new Stripe(stripeKey);

     
        const newOrder = await orderModel.create({
            userId,
            items,
            amount,
            address,
            payment: false
        });

  
        await userModel.findByIdAndUpdate(userId, {
            cartData: {}
        });

    
        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

    
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 200
            },
            quantity: 1
        });

        const frontend_url =
            process.env.FRONTEND_URL || "https://food-ecommerce-frontend-ok9d.onrender.com";

    
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",

            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,

            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.status(200).json({
            success: true,
            session_url: session.url
        });

    } catch (error) {

        console.log("placeOrder error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const verifyOrder = async (req, res) => {

    try {

        const { orderId, success } = req.body;

        console.log("VERIFY DATA:", req.body);

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Missing orderId"
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // IMPORTANT FIX
        if (success === "true") {

            await orderModel.findByIdAndUpdate(orderId, {
                payment: true
            });

            return res.status(200).json({
                success: true,
                message: "Payment Successful"
            });

        } else {

            await orderModel.findByIdAndDelete(orderId);

            return res.status(200).json({
                success: false,
                message: "Payment Failed"
            });
        }

    } catch (error) {

        console.log("verifyOrder error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const userOrders = async(req, res) =>{
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        console.log("Fetching orders for userId:", userId);
        const orders = await orderModel.find({userId});
        console.log("Orders found:", orders.length);

        res.json({success:true,data:orders})
        
    } catch (error) {
        console.log("userOrders error:", error)
        res.status(500).json({success:false,message:"Internal server error"})
        
    }

}
//listing order for admin pannels

const listOrders = async(req,res)=>{

    try {
        const orders = await orderModel.find({})
        res.json({success:true,data:orders})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"error"})
        
    }


}


//api for updating order status
const updateStatus = async(req,res)=>{

    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"error"})
        
    }

}

export { placeOrder, verifyOrder, userOrders, listOrders,updateStatus };
