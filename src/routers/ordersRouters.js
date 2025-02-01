const _express = require('express');
const router = _express.Router();

const {orders, orderDetail, users} = require('../models');

const {createID} = require("../utils/global_functions");

//post: create new order
router.post('/api/create-new-order', async (req, res) => {
    try {
        const dateCreate = new Date();
        console.log(req.body);
        const id = dateCreate.getTime().toString();
        const newOrder = await orders.create({
            id: id,
            user_id: req.body.user_id,
            cost: req.body.cost,
            status: req.body.status,
            createat: new Date(),
        });

        if (!newOrder) {
            return res.status(400).json({message: 'Created failed'});
        } else {
            for (let i = 0; i < req.body.list.length; i++) {
                const newOrderDetail = await orderDetail.create({
                    order_id: id,
                    product_id: req.body.list[i].product_id,
                    amount: req.body.list[i].amount,
                    cost: req.body.list[i].cost
                }, {
                    returning: ['order_id', 'product_id', 'amount', 'cost'], // Chỉ định các cột trả về
                })
            }
            res.status(200).json({message: 'Order created successfully'});
        }

    } catch (err) {
        console.error(err);
    }
})

//get: get all order from any customer
router.get('/api/-get-all-orders/:id', async (req, res) => {
    try {
        const result = await orders.findAll({
            where: {
                user_id: req.params.id,
            }
        })
        if (!result) {
            res.status(404).json({message: 'No order found with this user\'s id'});
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
    }
})
module.exports = router;