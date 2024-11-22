import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required. Please login.' 
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Add user ID to request
            req.body.userId = decoded.id;
            next();
        } catch (jwtError) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token. Please login again.' 
            });
        }

    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server authentication error' 
        });
    }
};

export default authUser;