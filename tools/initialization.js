const User = require("../models/user");
const bcrypt = require('bcryptjs');

// Initialize of the ADMIN
const initialization = async function () {
    try {
        // Check if there is an ADMIN
        const ADMIN_EXISTS = await User.findOne({
            role: 'admin'
        });
        if (ADMIN_EXISTS) {
            return console.log('Admin Done!');
        };

        // make an ADMIN
        const ADMIN = new User({
            firstName: 'ali',
            lastName: 'kuchulu',
            userName: 'ali',
            email: "alikuchulu@gmail.com",
            password: "123456789",
            gender: 'Male',
            phoneNumber: '09125544712',
            role: 'admin'
        });
        // Hash password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(ADMIN.password, salt, (err, hash) => {
            if (err) throw err;
            // Set the password to hashed password
            ADMIN.password = hash;
            ADMIN.save()
                .then(() => {
                    console.log('Admin created');
                })
                .catch(err => {
                    console.log("ADMIN initialize did not work!");
                    
                })
        }));

    } catch (err) {
        console.log('Error in intialization function', err);
    };
};

module.exports = initialization;