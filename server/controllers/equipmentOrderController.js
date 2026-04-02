import EquipmentOrder from '../models/EquipmentOrder.js';
import User from '../models/User.js';

// Создание заказа на оборудование
export const createEquipmentOrder = async (req, res) => {
  try {
    const { productName, productId, name, phone, comment } = req.body;
    const userId = req.user.id;

    if (!productName || !name || !phone) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

    if (name.length < 2) {
      return res.status(400).json({ error: 'Имя должно содержать минимум 2 символа' });
    }

    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ error: 'Введите корректный номер телефона' });
    }

    const order = await EquipmentOrder.create({
      productName,
      productId: productId || null,
      name,
      phone,
      comment: comment || null,
      userId,
      status: 'new',
    });

    res.status(201).json({
      message: 'Заказ на оборудование успешно отправлен',
      order: {
        id: order.id,
        productName: order.productName,
        name: order.name,
        phone: order.phone,
        comment: order.comment,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Create equipment order error:', error);
    res.status(500).json({ error: 'Ошибка при отправке заказа' });
  }
};

// Получение заказов пользователя
export const getUserEquipmentOrders = async (req, res) => {
  try {
    const orders = await EquipmentOrder.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    // Убедитесь, что orders содержит adminComment
    console.log('Orders with adminComment:', orders.map(o => ({ id: o.id, adminComment: o.adminComment })));
    res.json({ orders });
  } catch (error) {
    console.error('Get equipment orders error:', error);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
};

// Получение всех заказов (админ)
export const getAllEquipmentOrders = async (req, res) => {
  try {
    const orders = await EquipmentOrder.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ orders });
  } catch (error) {
    console.error('Get all equipment orders error:', error);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
};

// Обновление статуса и комментария (админ)
export const updateEquipmentOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    const validStatuses = ['new', 'processing', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }

    const order = await EquipmentOrder.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    if (status) order.status = status;
    if (adminComment !== undefined) order.adminComment = adminComment;

    await order.save();

    res.json({
      message: 'Заказ обновлен',
      order: {
        id: order.id,
        status: order.status,
        adminComment: order.adminComment,
      },
    });
  } catch (error) {
    console.error('Update equipment order error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении заказа' });
  }
};

// Удаление заказа (админ)
export const deleteEquipmentOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await EquipmentOrder.findByPk(id);
    
    if (!order) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    await order.destroy();
    res.json({ message: 'Заказ успешно удален' });
  } catch (error) {
    console.error('Delete equipment order error:', error);
    res.status(500).json({ error: 'Ошибка при удалении заказа' });
  }
};