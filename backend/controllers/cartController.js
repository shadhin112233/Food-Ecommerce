import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const userData = await userModel.findById(userId);

        let cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added To Cart" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        // optional: remove item if 0
        if (cartData[req.body.itemId] === 0) {
            delete cartData[req.body.itemId];
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Removed From Cart" });

    } catch (error) {
        console.log("REMOVE CART ERROR:", error.message);
        res.json({ success: false, message: error.message });
    }
};


const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};

        res.json({ success: true, cartData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, removeFromCart, getCart }