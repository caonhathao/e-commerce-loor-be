/*these are all api to get and handle with brand */
const {createID, encryptPW} = require('../utils/global_functions');

const {Brands, users} = require('../models/_index');
const express = require("express");
const {createToken} = require("../security/JWTProvider");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const authenticateToken = require("../security/JWTAuthentication");
const {Sequelize} = require("sequelize");
const {getIO} = require("../services/websocket");

//post: sign-in and sign-up
router.post('/api/brand-login', upload.none(), async (req, res) => {
    try {
        const brand = await Brands.findOne({
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
        const check = await Brands.findOne({
            where: {
                email: req.body.email,
            }
        })

        if (!check) {
            const brand_id = createID('BRAND');
            const newBrand = await Brands.create({
                id: brand_id,
                name: req.body.name ? req.body.name : brand_id,
                password: encryptPW(req.body.password),
                email: req.body.email,
                numberphone: req.body.numberphone,
                is_locked: true, //when the brand (vendor) updates their address, their account will be unlocked
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

//post: verify account for vendor
router.post('/api/brand/authenticate/:userId', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const brand = await Brands.findOne({where: {id: req.params.userId}});
            if (!brand) {
                res.status(404).json({message: 'This brand was not found'});
            }
            if (brand.password !== encryptPW(req.body.password)) {
                res.status(401).json({message: 'Password is incorrect'});
            } else res.status(200).json({message: 'Verify successful!'});
        } catch (err) {
            console.log(err)
        }
})

//get: get all info or one
//get one:
router.get('/api/get-brand-by-id/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER' && req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const brand = await Brands.findOne({where: {id: req.params.id}, attributes: {exclude: ['password']},});
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
            const allBrands = await Brands.findAll();
            res.json(allBrands);
        } catch (err) {
            console.log(err)
        }
})

//get products by keyword
//need two params: brand's id and keyword
router.get('/api/get-product-by-key/:id/:k', async (req, res) => {
    try {
        const key = req.params.k.toLowerCase();
        const results = await products.findAll({
            where: {
                [Op.and]: [
                    Sequelize.literal(`pro_tsv @@ plainto_tsquery('vn_unaccent', '${key}')`),
                    {id: req.params.id}
                ]
            },
        })

        if (!results) res.status(404).json({message: 'No product found with keyword'});
        else {
            const io = getIO();
            io.emit('search-product', results);
            res.status(200).json('Search successfully!');
        }
    } catch (err) {
        console.error(err);
    }
})

//put: update brand's info
router.put('/api/brand-update/:id', authenticateToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const updateFields = {};
            if (req.body.name && req.body.name !== '') {
                updateFields.name = req.body.name;
            }
            if (req.body.numberphone && req.body.numberphone !== '') {
                updateFields.numberphone = req.body.numberphone;
            }
            if (req.body.email && req.body.email !== '') {
                updateFields.email = req.body.email;
            }
            if (req.body.address && req.body.address !== '') {
                updateFields.address = req.body.address;
            }

            if (Object.keys(updateFields).length > 0) {
                const brand = await Brands.update(
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
            await Brands.update({is_locked: true,}, {where: {id: req.params.id}});

            res.status(200).json('Banned successfully');

        } catch (err) {
            res.status(500).json({message: 'error: ', error: err.message});
        }
})

router.put('/api/manager/lock-brand-by-id/:id', authenticateToken, async (req, res) => {
    try {
        const brand = await Brands.update({is_locked: true,}, {where: {id: req.params.id}});

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
            const brand = await Brands.update({is_locked: false,}, {where: {id: req.params.id}});

            if (!brand) {
                res.status(404).json({message: 'No user with this id'});
            }
            res.status(200).json('successfully');

        } catch (err) {
            res.status(500).json({message: 'error: ', error: err.message});
        }
})

module.exports = router;