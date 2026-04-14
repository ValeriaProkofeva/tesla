import Consultation from '../models/Consultation.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const createConsultation = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    if (name.length < 2) {
      return res.status(400).json({ error: 'Имя должно содержать минимум 2 символа' });
    }

    if (name.length > 30) {
      return res.status(400).json({ error: 'Имя не должно превышать 30 символов' });
    }

    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ error: 'Введите корректный номер телефона' });
    }

    const consultation = await Consultation.create({
      name,
      phone,
      userId,
      status: 'new',
    });

    res.status(201).json({
      message: 'Заявка успешно отправлена',
      consultation: {
        id: consultation.id,
        name: consultation.name,
        phone: consultation.phone,
        status: consultation.status,
        createdAt: consultation.createdAt,
      },
    });
  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({ error: 'Ошибка при отправке заявки' });
  }
};

export const getUserConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({ consultations });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ error: 'Ошибка при получении заявок' });
  }
};

export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ consultations });
  } catch (error) {
    console.error('Get all consultations error:', error);
    res.status(500).json({ error: 'Ошибка при получении заявок' });
  }
};

export const updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }

    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    consultation.status = status;
    await consultation.save();

    res.json({
      message: 'Статус заявки обновлен',
      consultation: {
        id: consultation.id,
        status: consultation.status,
      },
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
};

export const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    await consultation.destroy();

    res.json({ message: 'Заявка успешно удалена' });
  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({ error: 'Ошибка при удалении заявки' });
  }
};