const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const userExist = await User.findOne({ email });
  
if (!userExist) {
    return response.status(400).json({ error: 'email o contraseña invalidos'});
}

if (!userExist.verified) {
    return response.status(400).json({ error: 'Tu email no esta verificado'});
}

const isCorrect = await bcrypt.compare(password, userExist.passwordHash);

if (!isCorrect) {
    return response.status(400).json({ error: 'email o contraseña invalidos'});
}

const userForToken = {
    id: userExist.id,
}

const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET,  {
expiresIn: '1d'
});

// Establecer la cookie en la respuesta
response.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // Tiempo de vida de la cookie en milisegundos (1 día en este ejemplo)
  });

response.redirect('/agenda');
console.log(accessToken);

});

module.exports = loginRouter;