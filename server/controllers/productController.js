import Product from '../models/Product.js';
import { Op } from 'sequelize';

// Получить все товары
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
};

// Получить товары по категории
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.findAll({
      where: { category },
      order: [['createdAt', 'DESC']],
    });
    res.json({ products });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ error: 'Ошибка при получении товаров' });
  }
};

// Получить один товар
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Ошибка при получении товара' });
  }
};

// Создать товар (только админ)
export const createProduct = async (req, res) => {
  try {
    const { name, category, image, shortDescription, fullDescription, specifications, price, inStock } = req.body;
    
    if (!name || !category || !shortDescription || !fullDescription) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }
    
    const product = await Product.create({
      name,
      category,
      image: image || '/images/products/default.jpg',
      shortDescription,
      fullDescription,
      specifications: specifications || [],
      price: price || null,
      inStock: inStock !== undefined ? inStock : true,
    });
    
    res.status(201).json({
      message: 'Товар успешно создан',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Ошибка при создании товара' });
  }
};

// Обновить товар (только админ)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, image, shortDescription, fullDescription, specifications, price, inStock } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (fullDescription !== undefined) product.fullDescription = fullDescription;
    if (specifications !== undefined) product.specifications = specifications;
    if (price !== undefined) product.price = price;
    if (inStock !== undefined) product.inStock = inStock;
    
    await product.save();
    
    res.json({
      message: 'Товар успешно обновлен',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении товара' });
  }
};

// Удалить товар (только админ)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    await product.destroy();
    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Ошибка при удалении товара' });
  }
};

// Получить все категории
export const getCategories = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
    });
    const categories = products.map(p => p.category);
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
};