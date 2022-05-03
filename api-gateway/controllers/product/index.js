const adapter = require('../../utils/apiAdapter');

const {
    PRODUCT_SERVICE_URL,
    SELLER_SERVICE_URL
} = process.env;

const apiProduct = adapter(PRODUCT_SERVICE_URL);
const apiSeller = adapter(SELLER_SERVICE_URL);

module.exports = {
    register: async (req,res) => {
        try {
            const {seller_id} = req.body;
            const isSellerExist = await apiSeller.get(`/sellers/${seller_id}`);
    
            if (!isSellerExist.status) {
                res.respondBadRequest('seller doesn\'t exist');
                return false;
            }
    
            const response = await apiProduct.post(`/products`, req.body);
    
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
            const response = await apiProduct.get(`/products/${req.params.id}`);
            res.status(response.status).json(response.data);
        } catch (err) {
            if (err.code === 'ECONNREFUSED') {
                return res.respondServerError('service unavailable');
            }
            const { status, data } = err.response;
            console.log(status);
            return res.status(status).json(data);
        }
    },

    index: async (req,res) => {
        try {
            const response = await apiProduct.get(`/products${req.url}`);
            res.status(response.status).json(response.data);
        } catch (err) {
            console.log(err.code);
            if (err.code === 'ECONNREFUSED') {
                return res.respondServerError('service unavailable');
            }
            const { status, data } = err.response;
            return res.status(status).json(data);
        }
    },

    update: async (req,res) => {
        try {
            const {seller_id} = req.body;
            if (seller_id) {
                const isSellerExist = await apiSeller.get(`/sellers/${seller_id}`);
                if (!isSellerExist.status) {
                    res.respondBadRequest('seller doesn\'t exist');
                    return false;
                }
            }
            const response = await apiProduct.put(`/products/${req.params.id}`,req.body);
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
            const response = await apiProduct.delete(`/products/${res.params.id}`);
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