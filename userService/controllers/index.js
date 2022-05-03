const {User, Sequelize} = require('../models');
const { Op } = require("sequelize");
const helper = require('../helpers');
const Validator = require('fastest-validator');
const v = new Validator();
const bcrypt =require('bcrypt');
const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_HOST,
    DB_DIALECT,
    DB_PORT,
} = process.env;

module.exports = {
    register: async (req,res) => {
        try {
            const schema = {
                name: 'string|min:3|max:255',
                email: 'email',
                password: 'string'
            };
    
            const validation = v.validate(req.body, schema);
    
            if (validation.length) {
                res.respondBadRequest(validate);
                return false;
            }
    
            const {name, email, password} = req.body;
    
            const isPassValid = helper.validatePassword(password);
    
            if(!isPassValid.success) {
                res.respondBadRequest(isPassValid.message);
                return false;
            }
    
            const hashPassword = await bcrypt.hash(password, 10)
            
            
            const [user, created] = await User.findOrCreate({
                where : {
                    [Op.or] : [ {name}, {email} ]
                },
                default : {
                    name, email, password:hashPassword
                }
            });
    
            if (!created) {
                res.badRequest('Name or email is already exist');
                return false;
            }
    
            res.respondCreated(user);

        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    show: async (req,res) => {
        try {
            const user_id = req.params.id;
    
            const user = await User.findOne({
                where: {
                    id:user_id
                }
            });
    
            if (!user) {
                res.respondNotFound(`user with id ${user_id} doesn\'t exist`);
                return false;
            }
    
            res.respondSuccess(user, 'user created!');
        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    index: async (req,res) => {
        try {
            const sequelize = new Sequelize(`${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
    
            let query = `SELECT * FROM "Users"`;
    
            const {name, email} = req.query;
    
            if (name) {
                query += ` WHERE name like '%${name}%'`;
            }
    
            if (email) {
                if (name) {
                    query += ` OR email like '%${email}%'`;
                } else {
                    query += ` WHERE email like '%${email}%'`;
                }
            }
    
            const [users, meta] = await sequelize.query(query);
    
            if (!users) {
                res.respondNotFound('data not found!');
                return false;
            }
    
            res.respondSuccess(users);
        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    update: async (req,res) => {
        try {
            const user_id = req.params.id;
    
            const isUserExist = await User.findOne({
                where: {
                    id:user_id
                }
            });
    
            if(!isUserExist) {
                res.respondBadRequest(`no user with id ${user_id}`);
                return false;
            }
    
            const schema = {
                name: 'string|min:3|max:255|optional',
                email: 'email|optional',
                password: 'string|optional'
            };
    
            const validation = v.validate(req.body, schema);
    
            if(validation.length) {
                res.respondBadRequest('invalid input');
                return false;
            }
    
            const {name, email, password} = req.body;
    
            const isPassValid = helper.validatePassword(password);
    
            if(!isPassValid.success) {
                res.respondBadRequest(isPassValid.message);
                return false;
            }
            
            if (password) {
                const hashPassword = bcrypt.hash(password, 10);
                password = hashPassword;
            }
    
            const updatedUser = await User.update({
                name, email, password
            },
            {
                where: {id:user_id}
            });
    
            res.respondUpdated(updatedUser);
        } catch (err) {
            res.respondServerError(err.message);
        }
    },

    delete: async (req,res) => {
        try {
            const user_id = req.params.id;
    
            const deletedUser = await User.destroy({
                where: {
                    id:user_id
                }
            });
    
            if (!deletedUser) {
                res.respondNotFound(`can\'t find user with id ${user_id}`);
                return false;
            }
    
            res.respondDeleted(deletedUser);
        } catch (err) {
            res.respondServerError(err.message);
        }
    }
}
