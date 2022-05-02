module.exports = (req,res,next) => {
    res.respond = (
        data = null,
        message = '',
        statusCode = 200,
        status = true
    ) => {
        if (statusCode >= 400) status = false;

        res.status(statusCode).json({
            status,
            message,
            data
        });
    };


    //Success
    res.respondSuccess = (data = null, message = 'success!') => {
        res.respond(data, message, 200);
    };

    res.respondCreated = (data = null, message = 'data created!') => {
        res.respond(data, message, 201);
    };

    res.respondUpdated = (data = null, message = 'data updated!') => {
        res.respond(data, message, 201);
    };

    res.respondUpdated = (data = null, message = 'data deleted!') => {
        res.respond(data,message, 200);
    };

    //Error
    res.respondBadRequest = (message = 'bad request', data = null) => {
        res.respond(data, message, 400);
    };
    
    res.respondNotFound = (message = 'data doesn\'t exist', data = null) => {
        res.respond(data,message, 404);
    };

    res.respondServerError = (message = 'server error!', data = null) => {
        res.respond(data,message, 500);
    }


    next();
};