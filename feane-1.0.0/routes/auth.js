const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock database
const users = [];

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email: user.email }, 'your_secret_key', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/auth/profile');
    } else {
        res.redirect('/auth/login');
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, email, password: hashedPassword });
    res.redirect('/auth/login');
});

router.get('/profile', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, 'your_secret_key', (err, decoded) => {
            if (err) {
                res.redirect('/auth/login');
            } else {
                const user = users.find(u => u.email === decoded.email);
                res.render('profile', { user });
            }
        });
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;
