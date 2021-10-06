
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
    '/',
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists' }] });
            }
            const avatar =
                gravatar.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
            user = new User({
                name,
                email,
                avatar,
                password
            });
            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            // declaring the playload for the jwt token
            const playload = {
                user: {
                    id: user._id
                }
            }
            // as the user gets registered token is generated
            jwt.sign(playload, config.get("jwtSecret"), { expiresIn: 3600000 }, (err, token) => {
                if (err) {
                    throw err
                } else {
                    res.json({ token })
                }
            })
            
        }
        catch (err) {
            throw err;
        }
    });
module.exports = router