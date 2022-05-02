require('dotenv').config();

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_HOST,
    DB_DIALECT,
    DB_PORT
    } = process.env

const {Seller, Sequelize} = require('../models');

const Validator = require('fastest-validator');

const v = new Validator();

const {Op} = require('sequelize');

module.exports = {
    register: async (req,res) => {
        try {
            const {store_name, user_id} = req.body;
    
            const scheme = {
                store_name: 'string',
                user_id: 'number|integer|postive'
            };
    
            const validation = v.validate(req.body, scheme);
    
            if (validation.length) {
                res.respondBadRequest('invalid input');
                return false;
            }
    
            const [createdSeller, isCreated] = await Seller.findOrCreate({
                where: {
                    [Op.or]:[{store_name}, {user_id}]
                },
                default :{
                    store_name, user_id
                }
            });

            if(!isCreated) {
                res.respondBadRequest(`store name or user id is already exist`);
                return false;
            }
    
            res.respondCreated(createdSeller);
        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    detail: async (req,res) => {
        try {
            const seller_id = req.params.id;
            
            const sellerDetail = await Seller.findOne({
                where: {
                    id:seller_id
                }
            });

            console.log(sellerDetail);
            
            if(!sellerDetail) {
                res.respondBadRequest(`seller with id ${seller_id} doesn\'t exist`);
                return false;
            }

            res.respondSuccess(sellerDetail);

        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    index: async (req,res) => {
        try {
            const sequelize = new Sequelize(`${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
    
            const {store_name} = req.query;
    
            let query = 'SELECT * FROM "Sellers"';
    
            if (store_name) {
                query += ` WHERE store_name like %${store_name}%`;
            }
    
            const [sellerList, meta] = await sequelize.query(query);
    
            if (!sellerList) {
                res.respondNotFound('seller not found');
                return false;
            }
    
            res.respondSuccess(sellerList);
        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    update: async (req,res) => {
        try {
            const seller_id = req.params.id;

            const isSellerIdExist = await Seller.findOne({
                where: {
                    id:seller_id
                }
            }) 

            if (!isSellerIdExist) {
                res.respondBadRequest(`seller with id ${seller_id} doesn\'t exist`);
                return false;
            }

            const scheme = {
                store_name: 'string|optional',
                user_id: 'number|integer|postive|optional'
            };

            const validation = v.validate(req.body, scheme);

            if (validation.length) {
                res.respondBadRequest(validation);
                return false;
            }

            const {store_name, user_id} = req.body;
            
            const isSellerExist = await Seller.findOne({
                where: {
                    [Op.or]:[{store_name}, {user_id}]
                }
            });

            if(isSellerExist) {
                res.respondBadRequest('store name or user id is already exist');
                return false;
            }

            const updatedSeller = await Seller.update({
                store_name, user_id
            },
            {
                where: {
                    id:seller_id
                }
            });

            res.respondUpdated(updatedSeller);

        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    delete: async (req,res) => {
        try {
            const seller_id = req.params.id;
    
            const deletedSeller = await Seller.destroy({
                where: {
                    id:seller_id
                }
            });
    
            if (!deletedSeller) {
                res.respondBadRequest(`seller with id ${seller_id} doesn\'t exist`);
                return false;
            }
    
            res.respondDeleted(deletedSeller);
        } catch (err) {
            res.respondServerError(err.message);
        }
    }
}