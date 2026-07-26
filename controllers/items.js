const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().collection('items').find();
        const items = await result.toArray();
        res.status(200).type('json').send(JSON.stringify(items, null, 2));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const itemId = new objectId(req.params.id);
        const result = await mongodb.getDatabase().collection('items').findOne({ _id: itemId });
        res.status(200).type('json').send(JSON.stringify(result, null, 2));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    const newItem = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    try {
        const result = await mongodb.getDatabase().collection('items').insertOne(newItem);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const update = async (req, res) => {
    const itemId = new objectId(req.params.id);
    const updatedItem = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    try {
        const result = await mongodb.getDatabase().collection('items').updateOne({ _id: itemId }, { $set: updatedItem });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteItem = async (req, res) => {
    const itemId = new objectId(req.params.id);
    try {
        const result = await mongodb.getDatabase().collection('items').deleteOne({ _id: itemId });
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
    delete: deleteItem
};