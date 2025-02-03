/*these are all api to get and handle with brand */
const {createID, encryptPW} = require('../utils/global_functions');

const {brands, users} = require('../models');
const express = require("express");
const {createToken} = require("../security/JWTProvider");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const authenticateToken = require("../security/JWTAuthentication");

//post: sign-in and sign-up
router.post('/api/brand-login', upload.none(), async (req, res) => {
    try {
        const brand = await brands.findOne({
            where: {
                email: req.body.email,
            }
        });

        if (!brand) {
            res.status(404).json({message: 'Sign in failed! Please check your email'});
        } else {
            if (brand.password !== encryptPW(req.body.password)) {
                res.status(401).json({message: 'Sign in failed! Invalid password'});
            } else {
                const payload = {
                    id: brand.id,
                    name: brand.name,
                    role: 'ROLE_VENDOR'
                };
                const token = createToken(payload, process.env.EXPIRES_IN_MONTH);
                res.status(200).json(token);
            }
        }
    } catch (err) {
        console.log(err)
    }
});

//send otp code to authentication email and number phone (in handle)
router.post('/api/create-brand', upload.none(), async (req, res) => {
    try {

        const check = await brands.findOne({
            where: {
                email: req.body.email,
            }
        })

        if (!check) {
            const brand_id = createID(req.body.name ?? req.body.numberphone);
            const newBrand = await brands.create({
                id: brand_id,
                name: req.body.name ? req.body.name : brand_id,
                password: encryptPW(req.body.password),
                email: req.body.email,
                numberphone: req.body.numberphone
            });

            if (!newBrand) {
                console.log(newBrand);
            } else {
                res.status(200).json({message: 'Sign up successful! Please sign-in again'});
            }
        } else res.status(404).json({message: 'Register failed! This email is already in use'});
    } catch (err) {
        console.log(err)
    }
});

//get: get all info or one
//get one:
router.get('/api/get-brand-by-id/:id', authenticateToken, async (req, res) => {
    try {
        const brand = await brands.findOne({where: {id: req.params.id}});
        if (!brand) {
            res.status(404).json({message: 'No brand with this id: ' + req.params.id});
        } else {
            res.status(200).json(brand);
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving user, ', error: err.message
        });
    }
});

//get all:
router.get('/api/manager/get-all-brands', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const allBrands = await brands.findAll();
            res.json(allBrands);
        } catch (err) {
            console.log(err)
        }
})

//put: update brand's info
router.put('/api/brand-update/:id', authenticateToken, upload.none(), async (req, res) => {
    try {
        const updateFields = {};
        if (req.body.numberphone && req.body.numberphone !== '') {
            updateFields.numberphone = req.body.numberphone;
        }
        if (req.body.email && req.body.email !== '') {
            updateFields.email = req.body.email;
        }
        if (Object.keys(updateFields).length > 0) {
            const brand = await brands.update(
                updateFields,
                {where: {id: req.params.id}}
            );
            if (!brand) {
                res.status(404).json({message: 'Update error! Please check your information again!'});
            } else {
                res.status(200).json({message: 'Update successful!'});
            }
        }
    } catch (err) {
        console.log(err)
    }
})

//put:lock brand
router.put('/api/system/lock-brand-by-id/:id', async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            await brands.update({is_locked: true,}, {where: {id: req.params.id}});

            res.status(200).json('Banned successfully');

        } catch (err) {
            res.status(500).json({message: 'error: ', error: err.message});
        }
})

router.put('/api/manager/lock-brand-by-id/:id', authenticateToken, async (req, res) => {
    try {
        const brand = await brands.update({is_locked: true,}, {where: {id: req.params.id}});

        if (!brand) {
            res.status(404).json({message: 'No brand with this id'});
        }
        res.status(200).json('successfully');

    } catch (err) {
        res.status(500).json({message: 'error: ', error: err.message});
    }
})

//put: restore brand
router.put('/api/restore-brand-by-id/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const brand = await brands.update({is_locked: false,}, {where: {id: req.params.id}});

            if (!brand) {
                res.status(404).json({message: 'No user with this id'});
            }
            res.status(200).json('successfully');

        } catch (err) {
            res.status(500).json({message: 'error: ', error: err.message});
        }
})

module.exports = router;