const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.JWT_SECRET || 'secret123';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido.' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Token inválido.' });

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

function authorizeRoles(...allowed) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Não autenticado.' });
    if (!allowed.includes(req.user.tipo)) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    next();
  };
}

module.exports = { authMiddleware, authorizeRoles };
