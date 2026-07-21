const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categories');

const validateCreateCategory = (req, res, next) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Name is required and cannot be empty' });
    }
    if (name.length < 2 || name.length > 100) {
        return res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
    }
    if (req.body.description && req.body.description.length > 500) {
        return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
    }

    next();
};

const validateUpdateCategory = (req, res, next) => {
    if (req.body.name !== undefined) {
        if (req.body.name.trim() === '') {
            return res.status(400).json({ message: 'Name cannot be empty' });
        }
        if (req.body.name.length < 2 || req.body.name.length > 100) {
            return res.status(400).json({ message: 'Name must be between 2 and 100 characters' });
        }
    }
    if (req.body.description && req.body.description.length > 500) {
        return res.status(400).json({ message: 'Description cannot exceed 500 characters' });
    }

    next();
};

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 */
router.get('/', getAllCategories);
router.post('/', validateCreateCategory, createCategory);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 *       400:
 *         description: Invalid ID format
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.get('/:id', getCategoryById);
router.put('/:id', validateUpdateCategory, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
