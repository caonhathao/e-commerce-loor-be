/*
* These are all api to get and handle with user's data
*/

const {createID, encryptPW} = require('../utils/global_functions');

const {users} = require('../models');
const _express = require('express');
const router = _express.Router();

//get user(s)
router.get('/api/manager/get-all-users', async (req, res) => {
    const allUsers = await users.findAll();
    res.json(allUsers);
});

router.get('/api/get-user-by-id/:id', async (req, res) => {
    try {
        const user = await users.findOne({
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

//post: create new
router.post('/api/create-user', async (req, res) => {
    // console.log(req.body.account_name);
    const user_id = createID(req.body.account_name);

    const newUser = await users.create({
        id: user_id, account_name: req.body.account_name, email: req.body.email, password: encryptPW(req.body.password),
    });
    res.json(newUser);
});

//post: user log in
const {createToken} = require('../security/JWTProvider');
router.post('/api/user-login', async (req, res) => {
    try {
        const user = await users.findOne({
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
                const payload = {userId: user.id, role: user.role, locked: user.is_locked};
                const token = createToken(payload, process.env.EXPIRES_IN_MONTH);
                res.status(200).json(token);
            }
        }
    } catch (err) {
        console.log(err);
    }
})

//lock account
router.put('/api/lock-user-by-id/:id', async (req, res) => {
    try {
        const user = await users.update({is_locked: true,}, {where: {id: req.params.id}});

        if (!user) {
            res.status(404).json({message: 'No user with this id'});
        }
        res.status(200).json('successfully');

    } catch (err) {
        res.status(500).json({message: 'error: ', error: err.message});
    }
})

//restore account
router.put('/api/restore-user-by-id/:id', async (req, res) => {
    try {
        const user = await users.update({is_locked: false,}, {where: {id: req.params.id}});

        if (!user) {
            res.status(404).json({message: 'No user with this id'});
        } else {
            const banned = await banned.findOne({
                where: {user_id: req.params.id}
            })

            if (!banned) {
                res.status(200).json('successfully');
            } else {
                res.status(404).json({message: 'This user can not restore, the user has banned'});
            }

        }
    } catch (err) {
        res.status(500).json({message: 'error: ', error: err.message});
    }
})

module.exports = router;