/*
* These are all api to get and handle with banned's data
* Banned table will store all user's id and the reasons to explain why they were banned from system
* Also, banned table will store brand's id, too.
 */

const {banned} = require('../models/_index');
const _express = require('express');
const router = _express.Router();
const {authenticateAccessToken} = require("../security/JWTAuthentication");

//get all banned
router.get('/api/user/get-all-banned',authenticateAccessToken, async (req, res) => {
    try {
        const allBanned = await banned.findAll();
        if (!allBanned) {
            res.status(404).send('No banned found');
        }
        res.status(200).json(allBanned);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//get all banned of any user/brand by user/brand's id
router.get('/api/user/get-all-banned-by-id/:id',authenticateAccessToken, async (req, res) => {
    try {
        const allBanned = await banned.findAll(
            {
                where: {user_id: req.params.id}
            }
        );
        if (!allBanned) {
            res.status(200).json('This user does not have any banned from system');
        }
        res.json(allBanned);
    } catch (err) {
        res.status(500).json({'error': 'Something went wrong'});
    }
})

//delete all banned of any user/brand by user/brand's id
router.post('/api/manager/delete-all-banned-by-id/:id', async (req, res) => {
    try {
        const deleted = await banned.destroy({where: {banned_id: req.params.id}});

        if (!deleted) {
            res.status(404).json('Something went wrong: Cannot find any object with this ID: ' + req.params.id);
        }
        res.status(200).json('deleted all banned with id ' + deleted.id + ' successfully!');
    } catch (err) {
        res.status(500).json({'error': 'Something went wrong'});
    }
})

//create new banned by user/brand's id
const moment = require('moment')
router.post('/api/manager/create-user-banned/:id', async (req, res) => {
    try {
        const newBanned = await banned.create({
            user_id: req.params.id,
            reason: req.body.reason,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        });

        res.status(200).json(newBanned);
    } catch (err) {
        res.status(500).json({'error': 'Something went wrong'});
    }
})

module.exports = router;