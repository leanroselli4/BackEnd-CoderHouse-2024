// middleware/authorization.js
const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }
    res.status(403).json({ error: 'Forbidden' });
  };
  
  const isUser = (req, res, next) => {
    if (req.user.role === 'user') {
      return next();
    }
    res.status(403).json({ error: 'Forbidden' });
  };
  
  export { isAdmin, isUser };