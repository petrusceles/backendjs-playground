const Validator = require('fastest-validator');
const v = new Validator();

const {Product, Sequelize} = require('../models');

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_HOST,
    DB_DIALECT,
    DB_PORT
    } = process.env;

module.exports = {
    register: async (req,res) => {
        try {
            const scheme = {
                name: 'string',
                price: 'number|positive',
                seller_id: 'number|positive',
                stock: 'number|positive'
            };
    
            const validation = v.validate(req.body, scheme);
    
            if (validation.length) {
                res.respondBadRequest(validation);
                return false;
            }
    
            const {name, price, seller_id, stock} = req.body;
            console.log(req.body);

    
            const [newProduct, isCreated] = await Product.findOrCreate({
                where: {
                    name
                },
                defaults: {
                    price, seller_id, stock
                }
            });
    
            if (!isCreated) {
                res.respondBadRequest('product name is already exist');
                return false;
            }
    
            res.respondCreated(newProduct);
        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    show: async(req,res) => {
        try {
            const product_id = req.params.id;
    
            const showProduct = await Product.findOne({
                where: {
                    id:product_id
                }
            });
    
            if (!showProduct) {
                res.respondBadRequest(`no product with id ${product_id}`);
                return false;
            }
    
            res.respondSuccess(showProduct);
        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    index: async (req,res) => {
        try {
            const databaseAccess = new Sequelize (`${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);

            let query = 'SELECT * FROM "Products"';

            const {name, minp, maxp, seller_id} = req.query;


            let iterator = [name, minp, maxp, seller_id];

            let iteratorFlag = true;

            iterator.forEach((element, i) => {
                if (element && iteratorFlag) {
                    query += " WHERE"
                    iteratorFlag = false;
                } else if (element && !iteratorFlag) {
                    query += " AND"
                }
                let queryDestination, op, m1, m2 = '';
                if (element) {
                    switch(i) {
                        case 0:
                            queryDestination = 'name';
                            op = 'like';
                            m1 = '\'%';
                            m2 = '%\'';
                            break;
                        case 1:
                            queryDestination = 'price'
                            op = '>=';
                            m1 = '';
                            m2 = '';
                            break;
                        case 2:
                            queryDestination = 'price'
                            op = '<=';
                            m1 = '';
                            m2 = '';
                            break;
                        case 3:
                            queryDestination = 'seller_id'
                            op = 'like';
                            m1 = '\'%';
                            m2 = '%\'';
                            break;
                        default:
                            queryDestination = ''
                            op = '';
                    }
                    console.log(m1);
                    query += ` ${queryDestination} ${op} ${m1}${element}${m2}`;
                }
            });

            const [productQueryResult,meta] = await databaseAccess.query(query);

            if (!productQueryResult) {
                res.respondBadRequest('invalid query');
                return false;
            }

            res.respondSuccess(productQueryResult);

        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    update: async (req,res) => {
        try {
            const product_id = req.params.id;
    
            const isProductExist = await Product.findOne({
                where: {
                    id:product_id
                }
            });
    
            if (!isProductExist) {
                res.respondBadRequest(`product with id ${product_id} doesn\'t exist`);
                return false;
            }
    
            const scheme = {
                name: 'string|optional',
                price: 'number|positive|optional',
                seller_id: 'number|positive|optional',
                stock: 'number|positive|optional'
            }
    
            const validation = v.validate(req.body, scheme);
    
            if (validation.length) {
                res.respondBadRequest(validation);
                return false;
            }

            const {name,price,seller_id,stock} = req.body;
    
            const updatedProduct = await Product.update({
                name, price, seller_id, stock
            },{
                where: {
                    id:product_id
                }
            });
    
            res.respondUpdated(updatedProduct);
        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    delete: async (req,res) => {
        const product_id = req.params.id;

        const deletedProduct = await Product.destroy({
            where: {
                id:product_id
            }
        });

        if (!deletedProduct) {
            res.respondBadRequest(`product with id ${product_id} doesn\'t exist`);
            return false;
        }

        res.respondDeleted(deletedProduct);
    }
}