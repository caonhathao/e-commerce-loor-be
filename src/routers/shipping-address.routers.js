//get all addresses
const {
    authenticateAccessToken, statusCode, router, ShippingAddress, catchAndShowError, upload, Provinces, Districts,
    createID
} = require("../shared/router-dependencies");
router.get('/api/user/get-all-address', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const result = await ShippingAddress.findAll({
                where: {
                    user_id: req.user.id,
                },
                attributes: {exclude: ['user_id']},
                order: [['is_default', 'DESC']],
            });

            if (!result) {
                return res.status(statusCode.errorHandle).json({message: 'No address found with this user\'s id'});
            }
            return res.status(statusCode.success).json(result);
        } catch (err) {
            catchAndShowError(err, res)
        }
})

//add or change address
router.post('/api/user/add-shipping-address', authenticateAccessToken, upload.none(), async (req, res) => {
    console.log(req.body)
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else {
        try {
            const cityExist = await Provinces.findOne({
                where: {
                    id: req.body.city,
                },
            })

            const wardExist = await Districts.findOne({
                where: {
                    province_id: req.body.city,
                    id: req.body.ward,
                },
            })

            let update
            if (req.body.is_default) {
                update = await ShippingAddress.update(
                    {is_default: false},
                    {
                        where: {
                            is_default: true,
                            user_id: req.user.id
                        }
                    }
                );
            }
            if (update === 0) return res.status(statusCode.errorHandle).json({message: 'Can not update default address'});
            else {
                console.log('update: ', update)
                const newAddress = await ShippingAddress.create({
                    id: createID('SHIP-ADDRESS'),
                    user_id: req.user.id,
                    address: req.body.address,
                    ward: wardExist.name,
                    city: cityExist.name,
                    is_default: req.body.is_default,
                })

                if (!newAddress) return res.status(statusCode.errorHandle).json({message: 'Add address failed! Please try again later'});
                return res.status(statusCode.success).json('Added address successfully');
            }
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})

router.put('/api/user/update-shipping-address', authenticateAccessToken, upload.none(), async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else {
        try {

            let objectValues = {};
            if (req.body.address && req.body.address !== '') {
                objectValues.address = req.body.address;
            }
            if (req.body.is_default && req.body.is_default !== '') {
                objectValues.is_default = req.body.is_default;
            }

            if (req.body.is_default) {
                await ShippingAddress.update(
                    {is_default: false},
                    {
                        where: {
                            is_default: true,
                            user_id: req.user.id
                        }
                    }
                );
            }

            if (Object.keys(objectValues).length > 0) {
                const [result] = await ShippingAddress.update(objectValues, {
                    where: {id: req.body.id}
                })
                if (result === 0) return res.status(statusCode.errorHandle).json({message: 'Add address failed! Please try again later'});
            }
            return res.status(statusCode.success).json('Update   address successfully');
        } catch (err) {
            catchAndShowError(err, res)
        }
    }
})

//remove address
router.delete('/api/user/remove-shipping-address', authenticateAccessToken, async (req, res) => {
    if (req.user.role !== 'ROLE_USER') {
        return res.status(statusCode.accessDenied).json({message: 'Access denied!'});
    } else
        try {
            const result = await ShippingAddress.destroy({
                where: {
                    id: req.body.id,
                    user_id: req.user.id
                }
            })
            if (result === 0) return res.status(statusCode.errorHandle).json({message: 'Remove address failed! Please try again later'});
            return res.status(statusCode.success).json('Remove address successfully');
        } catch (err) {
            catchAndShowError(err, res)
        }
})
module.exports = router;