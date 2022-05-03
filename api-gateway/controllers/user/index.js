const adapter = require('../../utils/apiAdapter');
const {
    USER_SERVICE_URL
} = process.env;

const api = adapter(USER_SERVICE_URL);

module.exports = {
    register: async (req,res) => {
        try {
            const response = await api.post('/users', req.body);
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
            const response = await api.get(`/users/${req.url}`);
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
            const response = await api.get(`/users${req.url}`);
            res.status(response.status).json(response.data);
        } catch (err) {
            console.log(err.status);
            if (err.code === 'ECONNREFUSED') {
                return res.respondServerError('service unavailable');
            }
            const { status, data } = err.response;
            return res.status(status).json(data);
        }
    },

    update: async (req,res) => {
        try {
            const response = await api.put(`/users/${req.url}`, req.body);
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
            const response = await api.delete(`/users/${req.url}`);
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