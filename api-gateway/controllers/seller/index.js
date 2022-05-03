const adapter = require('../../utils/apiAdapter');

const {
    SELLER_SERVICE_URL,
    USER_SERVICE_URL
} = process.env;

const apiSeller = adapter(SELLER_SERVICE_URL);
const apiUser = adapter(USER_SERVICE_URL);

module.exports = {
    register: async (req,res) => {
        try {
            const {user_id} = req.body;
            const isUserExist = await apiUser.get(`/users/${user_id}`);
    
            if (!isUserExist.status) {
                res.respondBadRequest('user doesn\'t exist');
                return false;
            }
    
            const response = await apiSeller.post(`/sellers`, req.body);
    
            res.status(response.status).json(response.data);
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                return res.respondServerError('service unavailable');
            }
            const { status, data } = err.response;
            return res.status(status).json(data);
        }
    },

    show: async (req,res) => {
        try {
            const response = await apiSeller.get(`/sellers/${req.id}`);
            res.status(response.status).json(response.data);
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                return res.respondServerError('service unavailable');
            }
            const { status, data } = err.response;
            return res.status(status).json(data);
        }
    },

    index: async (req,res) => {
        try {
            const response = await apiSeller.get(`/sellers/${req.url}`);
            res.status(response.status).json(response.data);
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                return res.respondServerError('service unavailable');
            }
            const { status, data } = err.response;
            return res.status(status).json(data);
        }
    },

    update: async (req,res) => {
        try {
            const {user_id} = req.body;
            if (user_id) {
                const isUserExist = await apiUser.get(`/users/${user_id}`);
                if (!isUserExist.status) {
                    res.respondBadRequest('user doesn\'t exist');
                    return false;
                }
            }
            const response = await apiSeller.put(`/sellers/${req.params.id}`, req.body);
            res.status(response.status).json(response.data);
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                return res.respondServerError('service unavailable');
            }
            const { status, data } = err.response;
            return res.status(status).json(data);
        }
    },

    delete: async (req,res) => {
        try {
            const response = await apiSeller.delete(`/sellers/${res.params.id}`);
            res.status(response.status).json(response.data);
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                return res.respondServerError('service unavailable');
            }
            const { status, data } = err.response;
            return res.status(status).json(data);
        }
    }
}