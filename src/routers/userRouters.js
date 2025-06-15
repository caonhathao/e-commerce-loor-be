/*
* These are all api to get and handle with user's data
*/

const {createID, encryptPW} = require('../utils/global_functions');

const {Users, UserRoles, TokenStore} = require('../models/_index');

const _express = require('express');
const router = _express.Router();

const multer = require('multer');
const upload = multer();
const {authenticateToken, authenticateAccessToken} = require("../security/JWTAuthentication");
const {generateAccessToken, generateRefreshToken} = require('../security/JWTProvider');
const authUtils = require('..//utils/authUtils')
const {sendAuthResponse} = require("../utils/authUtils");
const {TokenTracking, TokenUpdate, ValidateToken} = require("../security/TokenTracking");


//get user(s)
router.get('/api/manager/get-all-users', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const allUsers = await Users.findAll();
            if (!allUsers) {
                res.status(404).json({message: 'No Users found.'});
            }
            res.status(200).json(allUsers);
        } catch (err) {
            console.error(err);
        }
});

//get full info from any account
router.get('/api/get-user-by-id/:id', authenticateToken, async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                id: req.params.id,
            }
        });
        if (!user) {
            res.status(404).json({message: 'No user with this id'});
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving user, ', error: err.message
        });
    }
})

//post: sign-in and sign-up
router.post('/api/create-user', upload.none(), async (req, res) => {
        try {
            let newUser = {};
            try {
                const user_id = createID('USER');
                newUser = await Users.create({
                    id: user_id,
                    account_name: req.body.account_name,
                    email: req.body.email,
                    password: encryptPW(req.body.password),
                });
            } catch (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    const emailErr = err.errors.find(err => err.path === 'email');
                    if (emailErr) {
                        res.status(404).json({message: 'This email is already in use'});
                    }

                    const accountNameErr = err.errors.find(err => err.path === 'account_name');
                    if (accountNameErr) {
                        res.status(404).json({message: 'This account name is already in use'});
                    }
                } else {
                    console.error(err);
                    res.status(500).json({
                        message: 'Error creating user, ', error: err.message
                    });
                }
            }

            const updateRole = await UserRoles.create({
                id: createID('USER_ROLE'),
                user_id: newUser.id,
                role: 'ROLE_USER',
            })
            if (!updateRole) {
                res.status(404).json({
                    message: 'User role created failed'
                });
            } else {
                const payload = {id: newUser.id, role: updateRole.role, locked: newUser.is_locked};

                const user = {
                    id: newUser.id,
                    role: updateRole.role,
                    locked: newUser.is_locked,
                }
                const refreshToken = generateRefreshToken(payload);
                const accessToken = generateAccessToken(payload);

                await TokenTracking({
                    userID: newUser.id,
                    userType: 'user',
                    token: refreshToken,
                    req: req,
                    timer: process.env.EXPIRES_IN_WEEK,
                });
                sendAuthResponse(res, user, payload, process.env.EXPIRE_IN_WEEK, accessToken, refreshToken)
            }
        } catch
            (err) {
            console.error(err);
            res.status(500).json({message: 'Error creating user, ', error: err.message});
        }
    }
)
;

//post: user log in
router.post('/api/user-login', upload.none(), async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!user) {
            res.status(404).json({message: 'Sign in failed! Please check your email'});
        } else {
            if (user.password !== encryptPW(req.body.password)) {
                res.status(401).json({message: 'Sign in failed! Invalid password'});
            } else {
                const role = await UserRoles.findOne({
                    where: {
                        user_id: user.id
                    }
                })

                const payload = {id: user.id, role: role.role, locked: user.is_locked};

                const userData = {
                    id: user.id,
                    role: role.role,
                    locked: user.is_locked,
                }

                let refreshToken;
                let accessToken;

                const validate = await ValidateToken({userId: user.id});
                if (validate) {
                    refreshToken = generateRefreshToken(payload, process.env.EXPIRES_IN_WEEK);

                    const response = await TokenUpdate({
                        userID: user.id,
                        token: refreshToken,
                        req: req,
                        timer: process.env.EXPIRE_IN_WEEK,
                    });
                    if (!response) {
                        res.status(404).json({message: 'Sign in failed! Can not generate token'});
                    } else {
                        accessToken = generateAccessToken(payload, process.env.EXPIRE_IN_SHORT);
                        sendAuthResponse(res, userData, payload, process.env.EXPIRE_IN_WEEK, accessToken, refreshToken)
                    }
                } else {
                    refreshToken = generateRefreshToken(payload, process.env.EXPIRES_IN_WEEK);
                    accessToken = generateAccessToken(payload, process.env.EXPIRE_IN_SHORT);
                    await TokenTracking({
                        userID: user.id,
                        userType: 'user',
                        token: refreshToken,
                        req: req,
                        timer: process.env.EXPIRE_IN_WEEK,
                    })
                    sendAuthResponse(res, userData, payload, process.env.EXPIRE_IN_WEEK, accessToken, refreshToken)
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
})

//lock account
router.put('/api/system/lock-user-by-id/:id', async (req, res) => {
    try {
        await Users.update({is_locked: true,}, {where: {id: req.params.id}});
        res.status(200).json('successfully');

        //maybe the system will send the message to admin about its action when ban any account

    } catch (err) {
        res.status(500).json({message: 'error: ', error: err.message});
    }
})

router.put('/api/manager/lock-user-by-id/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(401).json({message: 'Access token is invalid'});
    } else
        try {
            await Users.update({is_locked: true,}, {where: {id: req.params.id}});
            res.status(200).json('successfully');
        } catch (err) {
            res.status(500).json({message: 'error: ', error: err.message});
        }
})

//restore account
router.put('/api/manager/restore-user-by-id/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        res.status(404).json({message: 'Access token is invalid'});
    } else
        try {
            const user = await Users.update({is_locked: false,}, {where: {id: req.params.id}});

            if (!user) {
                res.status(404).json({message: 'No user with this id'});
            } else {
                const ban = await banned.findOne({
                    where: {user_id: req.params.id}
                })

                if (!ban) {
                    res.status(200).json('successfully');
                } else {
                    res.status(404).json({message: 'This user can not restore, the user has banned'});
                }

            }
        } catch (err) {
            res.status(500).json({message: 'error: ', error: err.message});
        }
})

//put:update info
router.put('/api/update-user-info/:id', authenticateToken, upload.none(), async (req, res) => {
    try {
        console.log(req.body);
        const updateFields = {};

        if (req.body.full_name && req.body.full_name !== '') {
            updateFields.full_name = req.body.full_name;
        }
        if (req.body.account_name && req.body.account_name !== '') {
            updateFields.account_name = req.body.account_name;
        }
        if (req.body.birthday && req.body.birthday !== '') {
            updateFields.birthday = req.body.birthday;
        }
        if (req.body.email && req.body.email !== '') {
            updateFields.email = req.body.email;
        }
        if (req.body.numberphone && req.body.numberphone !== '') {
            updateFields.numberphone = req.body.numberphone;
        }
        if (req.body.address && req.body.address !== '') {
            updateFields.address = req.body.address;
        }

        if (Object.keys(updateFields).length > 0) {
            const result = await Users.update(updateFields, {
                where: {id: req.params.id}
            })
            if (!result) {
                res.status(404).json({message: 'Update failed'})
            }
            res.status(200).json({message: 'Updated successfully'})
        } else {
            res.status(403).json({message: 'No changes detected'});
        }
    } catch (err) {
        console.log(err);
    }
})

//put: change password
router.put('/api/change-password/:id', authenticateToken, upload.none(), async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!user) {
            res.status(404).json({message: 'No user with this id'});
        }
        if (encryptPW(req.body.oldPassword) === user.password) {
            await Users.update(
                {
                    password: encryptPW(req.body.newPassword)
                },
                {
                    where: {
                        id: req.params.id
                    }
                }
            )
            res.status(200).json({message: 'Changing password successfully'});
        } else
            res.status(404).json({message: 'Changing failed! Please check your password'});
    } catch
        (err) {
        console.log(err);
    }
})

//delete: delete account permanent
router.delete('/api/delete-account/:id', authenticateToken, async (req, res) => {
    try {
        const result = await Users.destroy({
            where: {id: req.params.id}
        })
        if (!result) {
            res.status(404).json({message: 'This action has been failed'});
        }
        res.status(200).json({message: 'Deleted this account successfully'});
    } catch (err) {
        console.error(err);
    }
})
module.exports = router;