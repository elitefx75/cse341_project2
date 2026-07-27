const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

const validateItemData = (data) => {
    const errors = [];
    const requiredFields = ['ItemID', 'Name', 'Category', 'Description', 'Price', 'Quantity', 'Supplier'];

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return ['Request body must be a JSON object'];
    }

    requiredFields.forEach((field) => {
        const value = data[field];

        if (field === 'Price' || field === 'Quantity') {
            if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
                errors.push(`${field} is required and must be a non-negative number`);
            }
        } else if (typeof value !== 'string' || value.trim() === '') {
            errors.push(`${field} is required`);
        }
    });

    return errors;
};

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
        const itemId = req.params.id;
        if (!objectId.isValid(itemId)) {
            return res.status(400).json({ message: 'Invalid item ID' });
        }

        const result = await mongodb.getDatabase().collection('items').findOne({ _id: new objectId(itemId) });
        res.status(200).type('json').send(JSON.stringify(result, null, 2));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const create = async (req, res) => {
    const errors = validateItemData(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    const newItem = {
        ItemID: req.body.ItemID.trim(),
        Name: req.body.Name.trim(),
        Category: req.body.Category.trim(),
        Description: req.body.Description.trim(),
        Price: req.body.Price,
        Quantity: req.body.Quantity,
        Supplier: req.body.Supplier.trim()
    };

    try {
        const result = await mongodb.getDatabase().collection('items').insertOne(newItem);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const update = async (req, res) => {
    const itemId = req.params.id;
    if (!objectId.isValid(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
    }

    const errors = validateItemData(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    const updatedItem = {
        ItemID: req.body.ItemID.trim(),
        Name: req.body.Name.trim(),
        Category: req.body.Category.trim(),
        Description: req.body.Description.trim(),
        Price: req.body.Price,
        Quantity: req.body.Quantity,
        Supplier: req.body.Supplier.trim()
    };

    try {
        const result = await mongodb.getDatabase().collection('items').updateOne({ _id: new objectId(itemId) }, { $set: updatedItem });
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteItem = async (req, res) => {
    const itemId = req.params.id;
    if (!objectId.isValid(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
    }

    try {
        const result = await mongodb.getDatabase().collection('items').deleteOne({ _id: new objectId(itemId) });
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