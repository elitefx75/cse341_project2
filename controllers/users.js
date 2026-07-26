const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const validateUserData = (data) => {
    const errors = [];
    const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return ['Request body must be a JSON object'];
    }

    requiredFields.forEach((field) => {
        const value = data[field];
        if (typeof value !== 'string' || value.trim() === '') {
            errors.push(`${field} is required`);
        }
    });

    if (data.email && typeof data.email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('email must be a valid email address');
    }

    return errors;
};

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().collection('users').find();
        const users = await result.toArray();
        res.status(200).type('json').send(JSON.stringify(users, null, 2));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!objectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const result = await mongodb.getDatabase().collection('users').findOne({ _id: new objectId(userId) });
        res.status(200).type('json').send(JSON.stringify(result, null, 2));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    const errors = validateUserData(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    const newUser = {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.trim(),
        favoriteColor: req.body.favoriteColor.trim(),
        birthday: req.body.birthday.trim()
    };

    try {
        const result = await mongodb.getDatabase().collection('users').insertOne(newUser);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const update = async (req, res) => {
    const userId = req.params.id;
    if (!objectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const errors = validateUserData(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    const updatedUser = {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.trim(),
        favoriteColor: req.body.favoriteColor.trim(),
        birthday: req.body.birthday.trim()
    };

    try {
        const result = await mongodb.getDatabase().collection('users').updateOne({ _id: new objectId(userId) }, { $set: updatedUser });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    if (!objectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const result = await mongodb.getDatabase().collection('users').deleteOne({ _id: new objectId(userId) });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    create,
    update,
    delete: deleteUser
};
