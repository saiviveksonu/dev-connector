const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require("../../middleware/auth")
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
// this "/" is equal to the endpoint /api/auth
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json(user)
    } catch (error) {
        console.log(error);
        res.status(500).send("server error")
    }
});
router.post(
    '/',
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Password is required'
    ).exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'invalid credentials' }] });
            }
            const ismatch = await bcrypt.compare(password, user.password)

            if (!ismatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'invalid credentials' }] });
            }
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
module.exports = router;
