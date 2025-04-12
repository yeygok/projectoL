const Service = require('../models/Service');

const getAllServices = async (req, res) => {
  try {
    const services = await Service.getAll();
    res.send(services);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener servicios' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).send({ error: 'Servicio no encontrado' });
    }
    res.send(service);
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener servicio' });
  }
};

const createService = async (req, res) => {
  try {
    const serviceId = await Service.create(req.body);
    res.status(201).send({ id: serviceId });
  } catch (error) {
    res.status(400).send({ error: 'Error al crear servicio' });
  }
};

const updateService = async (req, res) => {
  try {
    const serviceId = await Service.update(req.params.id, req.body);
    res.send({ id: serviceId });
  } catch (error) {
    res.status(400).send({ error: 'Error al actualizar servicio' });
  }
};

const deleteService = async (req, res) => {
  try {
    await Service.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar servicio' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
