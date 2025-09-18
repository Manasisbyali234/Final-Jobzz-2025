const jwt = require('jsonwebtoken');
const Candidate = require('../models/Candidate');
const Employer = require('../models/Employer');
const Admin = require('../models/Admin');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user;

      if (decoded.role === 'candidate') {
        user = await Candidate.findById(decoded.id).select('-password');
      } else if (decoded.role === 'employer') {
        user = await Employer.findById(decoded.id).select('-password');
      } else if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.user = user;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = auth;