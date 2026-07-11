import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_ninveh_2026';

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Add user payload to request
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error('Auth Error:', error);
      res.status(401).json({ status: 'error', message: 'غير مصرح لك بالوصول، التوكن غير صالح' });
    }
  }

  if (!token) {
    res.status(401).json({ status: 'error', message: 'غير مصرح لك بالوصول، لا يوجد توكن' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'ليس لديك صلاحية للوصول لهذا المسار' });
    }
    next();
  };
};
