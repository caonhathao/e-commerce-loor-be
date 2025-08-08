//get user(s)
const {authenticateAccessToken,router, statusCode, Users, catchAndShowError, ShippingAddress, createID, encryptPW,
    UserRoles, generateRefreshToken, generateAccessToken, TokenTracking, sendAuthResponse, upload, ValidateToken,
    TokenUpdate, chalk, destroyToCloudinary, getPublicIdFromURL, uploadToCloudinary, literal
} = require("../shared/router-dependencies");
router.get('/api/manager/get-all-users', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        return res.status(statusCode.accessDenied).json({message: 'Access token is invalid'});
    } else
        try {
            const allUsers = await Users.findAll({
                attributes: {
                    exclude: ['password']
                },
            });
            if (!allUsers) {
                res.status(404).json({message: 'No Users found.'});
            }
            res.status(200).json(allUsers);
        } catch (err) {
            catchAndShowError(err, res)
        }
});

//get full info from any account
router.get('/api/user/get-user-by-id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'Access token is invalid'});
    } else
        try {
            const user = await Users.findOne({
                where: {
                    id: req.user.id
                },
                attributes: {
                    exclude: ['password', 'createdAt', 'updatedAt'],
                    include: [
                        [
                            literal(`(
          SELECT COUNT(*) 
          FROM store.notify_user
          WHERE notify_user.user_id = "Users".id AND notify_user.status = 'IDLE'
        )`),
                            'notify_count'
                        ]
                    ]
                },
                include: [{
                    model: ShippingAddress,
                    as: 'ShippingAddress',
                    attributes: ['id', 'address', 'ward', 'city', 'country', 'zipcode', 'is_default'],
                    separate: true,
                    order: [['is_default', 'DESC']]
                }]
            });
            if (!user) {
                return res.status(statusCode.errorHandle).json({message: 'No user with this id'});
            }

            const result = user.toJSON();
            result.notify_count = Number(user.getDataValue('notify_count'));

            return res.status(statusCode.success).json(result);
        } catch (err) {
            catchAndShowError(err, res)
        }
})

//post: user register
router.post('/api/public/create-user', upload.none(), async (req, res) => {
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
                        res.status(statusCode.errorHandle).json({message: 'This email is already in use'});
                    }

                    const accountNameErr = err.errors.find(err => err.path === 'account_name');
                    if (accountNameErr) {
                        return res.status(statusCode.errorHandle).json({message: 'This account name is already in use'});
                    }
                } else {
                    catchAndShowError(err, res)
                }
            }

            const userRoleId = createID('USER_ROLE')
            const updateRole = await UserRoles.create({
                id: userRoleId,
                user_id: newUser.id,
                role: 'ROLE_USER',
            })

            if (!updateRole) {
                res.status(404).json({message: 'User role created failed'});
            } else {
                const payload = {id: newUser.id, role: updateRole.role, name: newUser.name, locked: newUser.is_locked};
                const user = {
                    id: newUser.id,
                    role: updateRole.role,
                    name: newUser.name,
                    locked: newUser.is_locked,
                }
                const refreshToken = generateRefreshToken(payload);
                const accessToken = generateAccessToken(payload);

                await TokenTracking({
                    userID: newUser.id,
                    userType: 'user',
                    token: refreshToken,
                    req: req,
                    timer: process.env.EXPIRE_IN_WEEK,
                });
                sendAuthResponse(res, user, payload, process.env.EXPIRE_IN_WEEK, accessToken, refreshToken)
            }
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
);

//post: user logs in
router.post('/api/public/user-login', upload.none(), async (req, res) => {
    // console.log(req.body)
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!user) {
           return  res.status(statusCode.errorHandle).json({message: 'Sign in failed! Please check your email'});
        } else {
            if (user.password !== encryptPW(req.body.password)) {
                return res.status(statusCode.errorHandle).json({message: 'Sign in failed! Invalid password'});
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
                    refreshToken = generateRefreshToken(payload, process.env.EXPIRE_IN_WEEK);

                    const response = await TokenUpdate({
                        user_id: user.id,
                        token: refreshToken,
                        req: req,
                        timer: process.env.EXPIRE_IN_WEEK,
                    });
                    if (!response) {
                        res.status(404).json({message: 'Sign in failed! Can not generate token'});
                    } else {
                        accessToken = generateAccessToken(payload, process.env.EXPIRE_IN_DAY);
                        sendAuthResponse(res, userData, payload, process.env.EXPIRE_IN_WEEK, accessToken, refreshToken)
                    }
                } else {
                    refreshToken = generateRefreshToken(payload, process.env.EXPIRES_IN_WEEK);
                    accessToken = generateAccessToken(payload, process.env.EXPIRE_IN_DAY);
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
        catchAndShowError(err, res)
    }
})

//lock account by system
router.put('/api/system/lock-user-by-id/:id', async (req, res) => {
    try {
        await Users.update({is_locked: true,}, {where: {id: req.params.id}});
        res.status(200).json('successfully');

        //maybe the system will send the message to admin about its action when ban any account

    } catch (err) {
        res.status(500).json({message: 'error: ', error: err.message});
    }
})

//lock user by manager
router.put('/api/manager/lock-user-by-id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        return res.status(statusCode.accessDenied).json({message: 'Access token is invalid'});
    } else
        try {
            await Users.update({is_locked: true,}, {where: {id: req.body.userID}});
            return res.status(statusCode.success).json('This user is locked');
        } catch (err) {
            catchAndShowError(err, res)
        }
})

//restore an account
router.put('/api/manager/restore-user-by-id', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_MANAGER') {
        return res.status(statusCode.accessDenied).json({message: 'Access token is invalid'});
    } else
        try {
            const user = await Users.update({is_locked: false,}, {where: {id: req.body.userID}});

            if (!user) {
                return res.status(statusCode.errorHandle).json({message: 'No user with this id'});
            } else {
                const ban = await Banned.findOne({
                    where: {user_id: req.body.userID}
                })

                if (!ban) {
                    return res.status(statusCode.success).json('Restore this user successfully');
                } else {
                    return res.status(statusCode.errorHandle).json({message: 'This user can not restore, the user has banned'});
                }

            }
        } catch (err) {
            catchAndShowError(err, res)
        }
})

//put:update info
router.put('/api/user/update-user-info', authenticateAccessToken, upload.array('images', 1), async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const userData = await Users.findOne({
                where: {
                    id: req.user.id
                }
            })

            if (!userData) {
                return res.status(statusCode.errorHandle).json({message: 'No user found with this id'});
            }

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
                const [result] = await Users.update(updateFields, {
                    where: {id: req.user.id}
                })
                if (result === 0) {
                    return res.status(statusCode.errorHandle).json({message: 'Update failed'})
                }
            }

            if (req.files && req.files.length > 0) {
                if (userData.image_link) {
                    console.log(chalk.green(userData.image_link))
                    await destroyToCloudinary(getPublicIdFromURL(userData.image_link, process.env.CLOUD_ASSET_F_USER));
                }
                const imageUrl = await uploadToCloudinary(req.files, process.env.CLOUD_ASSET_F_USER);

                if (!imageUrl) {
                    return res.status(statusCode.errorHandle).json({message: 'Upload image failed!'});
                }

                const [response] = await Users.update(
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
            catchAndShowError(err, res)
        }
})

//put: change password
router.put('/api/user/change-password', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else {
        try {
            const user = await Users.findOne({
                where: {
                    id: req.user.id
                }
            })

            if (!user) {
                return res.status(statusCode.errorHandle).json({message: 'No user found with this id'});
            }
            if (encryptPW(req.body.oldPassword) === user.password) {
                await Users.update(
                    {
                        password: encryptPW(req.body.newPassword)
                    },
                    {
                        where: {
                            id: req.user.id
                        }
                    }
                )
                return res.status(statusCode.success).json({message: 'Changing password successfully'});
            } else
                return res.status(statusCode.success).json({message: 'Changing failed! Please check your password'});
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})

//delete: delete account permanent
router.delete('/api/user/delete-account/:id', authenticateAccessToken, async (req, res) => {
    try {
        const result = await Users.destroy({
            where: {id: req.params.id}
        })
        if (!result) {
            return res.status(statusCode.errorHandle).json({message: 'This action has been failed'});
        }
        return res.status(statusCode.success).json({message: 'Deleted this account successfully'});
    } catch (err) {
        catchAndShowError(err, res)
    }
})
module.exports = router;