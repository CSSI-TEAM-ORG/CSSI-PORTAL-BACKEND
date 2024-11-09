import jsonwebtoken from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if (req.user.role != 'admin') {
        return res.status(401).json({ message: 'Unauthorized Access! Admin not found.' });
    }
}

export { verifyAdmin };
