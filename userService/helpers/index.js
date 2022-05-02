module.exports = {
    validatePassword: (pass) => {
        let data = {
            success: true,
            message: {}
        };
        
        const lowercase = /(?=.*[a-z])/;
        const uppercase = /(?=.*[A-Z])/;
        const number = /(?=.*[0-9])/;
        const specialChar = /(?=.*[!@#\$%\^&\*])/;
        const eightChar = /(?=.{8,})/;

        if (!eightChar.test(pass)) {
            data.success = false,
            data.message.eight_char = 'password must contain min 8 character!';
        }

        if (!lowercase.test(pass)) {
            data.success = false,
            data.message.lowercase = 'password must contain lowercase character!';
        }

        if (!uppercase.test(pass)) {
            data.success = false,
            data.message.uppercase = 'password must contain uppercase';
        }

        if (!number.test(pass)) {
            data.success = false,
            data.message.number = 'password must contain number';
        }

        if (!specialChar.test(pass)) {
            data.success = false,
            data.message.special_char = 'password must contain special character';
        }
        return data;

    }
};