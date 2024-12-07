const _createID = require('../handle_functions/global_functions');

const {users} = require('../models');
const _express = require('express');
const router = _express.Router();

//api get
router.get('/api/get-all-users', (req, res) => {
    const allUsers = users.findAll();
    res.json(allUsers);
});

//api post
router.post('/api/create-user', async (req, res) => {
    const body = req.body;

    const user_id = _createID(req.body.account_name);

    const newUser = await users.create({
        id: user_id,
        full_name: req.body.full_name ? req.body.full_name : "",
        account_name: req.body.account_name,
        birthday: req.body.birthday,
        email: req.body.email ? req.body.email : "",
        role: req.body.role ? req.body.role : "",
        numberphone: req.body.numberphone ? req.body.numberphone : "",
        password: req.body.password,
    });
    res.json(newUser);
})

module.exports = router;