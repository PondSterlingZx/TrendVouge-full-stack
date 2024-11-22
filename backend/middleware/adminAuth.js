import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Admin authentication required' 
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verify admin credentials
            if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Admin access denied' 
                });
            }
            
            next();
        } catch (jwtError) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired admin token' 
            });
        }

    } catch (error) {
        console.error('Admin Auth Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server authentication error' 
        });
    }
};

export default adminAuth;