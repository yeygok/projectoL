const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userId = await User.create({ name, email, password });
    
    const user = await User.findByEmail(email);
    const token = User.generateToken(user);
    
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await User.comparePasswords(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    const token = User.generateToken(user);
    res.send({ user, token });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
};

module.exports = { register, login };
