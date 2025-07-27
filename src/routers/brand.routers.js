/*these are all api to get and handle with brand */
const {createID, encryptPW} = require('../utils/functions.global');

const {Brands} = require('../models/_index');
const express = require("express");
const {generateRefreshToken, generateAccessToken} = require("../security/JWTProvider");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const {authenticateAccessToken} = require("../security/JWTAuthentication");
const {Sequelize} = require("sequelize");
const {getIO} = require("../services/websocket");
const {TokenTracking, TokenUpdate, ValidateToken} = require("../security/TokenTracking");
const {sendAuthResponse} = require("../utils/auth.utils");
const chalk = require("chalk");
const statusCode = require("../utils/statusCode");
const {uploadToCloudinary} = require("../controllers/uploadController");

//post: sign-in and sign-up
router.post('/api/public/brand-login', upload.none(), async (req, res) => {
    // console.log(req.body)
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
                res.status(404).json({message: 'Sign in failed! Invalid password'});
            } else {
                const payload = {id: brand.id, role: 'ROLE_VENDOR', locked: brand.is_locked, name: brand.name};
                const brandData = {id: brand.id, role: 'ROLE_VENDOR', locked: brand.is_locked, name: brand.name};

                let refreshToken;
                let accessToken;

                const validate = await ValidateToken({userId: brand.id});
                if (validate) {
                    refreshToken = generateRefreshToken(payload, process.env.EXPIRES_IN_WEEK);
                    const response = await TokenUpdate({
                        user_id: brand.id,
                        token: refreshToken,
                        req: req,
                        timer: process.env.EXPIRE_IN_WEEK,
                    });
                    if (!response) {
                        res.status(401).json({message: 'Sign in failed! Can not generate token'});
                    } else {
                        accessToken = generateAccessToken(payload, process.env.EXPIRE_IN_DAY);
                        sendAuthResponse(res, brandData, payload, process.env.EXPIRE_IN_WEEK, accessToken, refreshToken)
                    }
                } else {
                    refreshToken = generateRefreshToken(payload, process.env.EXPIRES_IN_WEEK);
                    accessToken = generateAccessToken(payload, process.env.EXPIRE_IN_DAY);

                    await TokenTracking({
                        userID: brand.id,
                        userType: 'brand',
                        token: refreshToken,
                        req: req,
                        timer: process.env.EXPIRE_IN_WEEK,
                    })
                    sendAuthResponse(res, brandData, payload, process.env.EXPIRE_IN_WEEK, accessToken, refreshToken)
                }
            }
        }
    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'})
    }
});

//send otp code to authentication email and number phone (in a handle)
router.post('/api/public/create-brand', upload.none(), async (req, res) => {
    try {
        let newBrand = {};
        try {
            const brand_id = createID('BRAND');
            newBrand = await Brands.create({
                id: brand_id,
                name: req.body.name ? req.body.name : brand_id,
                password: encryptPW(req.body.password),
                email: req.body.email,
                numberphone: req.body.numberphone,
                is_locked: true, //when the brand (vendor) updates their address, their account will be unlocked
            });

        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                const emailErr = err.errors.find(err => err.path === 'email');
                if (emailErr) {
                    res.status(404).json({message: 'This email is already in use'});
                }
                const nameErr = err.errors.find(err => err.path === 'name');
                if (nameErr) {
                    res.status(404).json({message: 'This brand name is already in use'});
                }
            } else {
                console.error(err);
                res.status(500).json({
                    message: 'Error creating brand, ', error: err.message
                });
            }
        }

        const payload = {id: newBrand.id, role: 'ROLE_VENDOR', locked: newBrand.is_locked};
        const brandData = {id: newBrand.id, role: 'ROLE_VENDOR', locked: newBrand.is_locked};

        const refreshToken = generateRefreshToken(payload, process.env.EXPIRES_IN_WEEK);
        const accessToken = generateAccessToken(payload, process.env.EXPIRE_IN_DAY);

        await TokenTracking({
            userID: newBrand.id,
            userType: 'brand',
            token: refreshToken,
            req: req,
            timer: process.env.EXPIRE_IN_WEEK,
        })
        sendAuthResponse(res, brandData, payload, process.env.EXPIRE_IN_WEEK, accessToken, refreshToken)

    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'})
    }
});

//post: user logout
router.post('/api/vendor/logout', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'Access token is invalid'});
    } else
        try {
            const response = await TokenStore.destroy({
                where: {
                    brand_id: req.user.id,
                    user_type: 'brand',
                    IP: req.ip || req.connection.remoteAddress,
                }
            })

            if (response === 0)
                return res.status(statusCode.errorHandle).json({message: 'Logout failed! Please try again later'});
            else
                return res.status(statusCode.success).json({message: 'Logout successfully'});
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'});
        }
})

router.post('/api/system/authentication/:id', authenticateAccessToken, async (req, res) => {
    try {
        if (req.user.role !== 'ROLE_VENDOR') {
            res.status(404).json({message: 'Access token is invalid'});
        } else {
            const record = await Brands.findOne({
                where: {id: req.params.id}
            })

            if (!record) {
                res.status(404).json({message: 'No brand with this id'});
            }
            res.status(200).json({message: 'Authentication successful'});
        }
    } catch (err) {
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'})
    }
})

//when a user gets brand's information
router.get('/api/public/get-brand-by-id/:id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER' && req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.errorHandle).json({message: 'Access token is invalid'});
    } else
        try {
            const brand = await Brands.findOne({
                where: {id: req.params.id},
                attributes: {exclude: ['password', 'is_locked', 'updatedAt']},
            });
            if (!brand) {
                return res.status(statusCode.empty).json({message: 'No brand with this id: ' + req.params.id});
            } else {
                return res.status(statusCode.success).json(brand);
            }
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Server error! Please try again later!'});
        }
});

//when a brand gets its information
router.get('/api/brand/get-profile', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.errorHandle).json({message: 'Access token is invalid'});
    } else
        try {
            const brand = await Brands.findOne({
                where: {id: req.user.id},
                attributes: {exclude: ['id', 'password', 'updatedAt']},
            });
            if (!brand) {
                return res.status(statusCode.empty).json({message: 'No brand with this id: ' + req.params.id});
            } else {
                return res.status(statusCode.success).json(brand);
            }
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Server error! Please try again later!'});
        }
});

//get all:
router.get('/api/manager/get-all-brands', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const allBrands = await Brands.findAll();
            res.json(allBrands);
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'})
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
        console.log(chalk.red(err));
        return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'})
    }
})

//put: update brand's info
router.put('/api/vendor/brand-update', authenticateAccessToken, upload.array("images", 1), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
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
            if (req.body.description && req.body.description !== '') {
                updateFields.description = req.body.description;
            }

            if (Object.keys(updateFields).length > 0) {
                const [result] = await Brands.update(
                    updateFields,
                    {where: {id: req.user.id}}
                );
                if (result === 0) {
                    return res.status(statusCode.errorHandle).json({message: 'Update error! Please check your information again!'});
                }
            }

            if (req.files && req.files.length > 0) {
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_VENDOR);

                if (!imageUrl) {
                    return res.status(statusCode.errorHandle).json({message: 'Upload image failed!'});
                }

                const [response] = await Brands.update(
                    {image_link: imageUrl.toString()}, {
                        where: {id: req.user.id}
                    })
                if (response === 0) {
                    return res.status(statusCode.errorHandle).json({message: 'Update image failed!'});
                }
                return res.status(statusCode.success).json('Updated successfully');
            }
            return res.status(statusCode.success).json('Updated successfully');
        } catch (err) {
            console.log(chalk.red(err));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'})
        }
})

router.put('/api/vendor/change-password', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_VENDOR') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else {
        try {
            console.log(req.body);
            const check = await Brands.findOne({
                where: {id: req.user.id}
            })

            if (!check) {
                return res.status(statusCode.errorHandle).json({message: 'No brand with this id'});
            }

            if (check.password !== req.body.oldPassword) {
                return res.status(statusCode.errorHandle).json({message: 'Old password is incorrect'});
            } else {
                const [result] = await Brands.update(
                    {password: req.body.newPassword},
                    {where: {id: req.user.id}}
                );
                if (result === 0) {
                    return res.status(statusCode.errorHandle).json({message: 'Update error! Please check your information again!'});
                }
                return res.status(statusCode.success).json('Updated successfully');
            }
        } catch (e) {
            console.log(chalk.red(e));
            return res.status(statusCode.serverError).json({message: 'Internal server error! Please try again later!'})
        }
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

router.put('/api/manager/lock-brand-by-id/:id', authenticateAccessToken, async (req, res) => {
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
router.put('/api/restore-brand-by-id/:id', authenticateAccessToken, async (req, res) => {
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