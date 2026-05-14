import ServiceRequest from '../models/ServiceRequest.js';
import User from '../models/User.js';

const serviceTypes = {
  sale: 'Продажа оборудования',
  repair: 'Ремонт трансформаторов',
  electromontage: 'Промышленный электромонтаж',
  commissioning: 'Пуско-наладочные работы и ЭТЛ',
};

// Создание заявки на услугу
export const createServiceRequest = async (req, res) => {
  try {
    const { serviceType, serviceName, name, phone, comment  } = req.body;
    const userId = req.user.id;

    if (!serviceType || !name || !phone) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    if (!serviceTypes[serviceType]) {
      return res.status(400).json({ error: 'Неверный тип услуги' });
    }

    if (name.length < 2) {
      return res.status(400).json({ error: 'Имя должно содержать минимум 2 символа' });
    }

    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return res.status(400).json({ error: 'Введите корректный номер телефона' });
    }

    const serviceRequest = await ServiceRequest.create({
      serviceType,
      serviceName: serviceName || serviceTypes[serviceType],
      name,
      phone,
      userId,
      status: 'new',
      comment: comment || null,
    });

    res.status(201).json({
      message: 'Заявка на услугу успешно отправлена',
      request: {
        id: serviceRequest.id,
        serviceType: serviceRequest.serviceType,
        serviceName: serviceRequest.serviceName,
        name: serviceRequest.name,
        phone: serviceRequest.phone,
        status: serviceRequest.status,
        createdAt: serviceRequest.createdAt,
      },
    });
  } catch (error) {
    console.error('Create service request error:', error);
    res.status(500).json({ error: 'Ошибка при отправке заявки' });
  }
};

// Получение заявок пользователя
export const getUserServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ requests });
  } catch (error) {
    console.error('Get service requests error:', error);
    res.status(500).json({ error: 'Ошибка при получении заявок' });
  }
};

// Получение всех заявок (админ)
export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ requests });
  } catch (error) {
    console.error('Get all service requests error:', error);
    res.status(500).json({ error: 'Ошибка при получении заявок' });
  }
};

// Обновление статуса и комментария (админ)
export const updateServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    const validStatuses = ['new', 'processing', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }

    const request = await ServiceRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    if (status) request.status = status;
    if (comment !== undefined) request.comment = comment;

    await request.save();

    res.json({
      message: 'Заявка обновлена',
      request: {
        id: request.id,
        status: request.status,
        comment: request.comment,
      },
    });
  } catch (error) {
    console.error('Update service request error:', error);
    res.status(500).json({ error: 'Ошибка при обновлении заявки' });
  }
};

// Удаление заявки (админ)
export const deleteServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findByPk(id);
    
    if (!request) {
      return res.status(404).json({ error: 'Заявка не найдена' });
    }

    await request.destroy();
    res.json({ message: 'Заявка успешно удалена' });
  } catch (error) {
    console.error('Delete service request error:', error);
    res.status(500).json({ error: 'Ошибка при удалении заявки' });
  }
};

export { serviceTypes };