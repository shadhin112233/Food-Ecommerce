import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized login again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id
        };

        next();

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;