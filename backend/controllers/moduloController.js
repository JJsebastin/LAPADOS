const Modulo = require('../models/Modulo');

exports.listModuloz = async (req, res) => {
  try {
    const sort = req.query.sort || '-created_date';
    const limit = parseInt(req.query.limit) || 50;
    
    const moduloz = await Modulo.find()
      .sort(sort)
      .limit(limit);
    res.json(moduloz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterModuloz = async (req, res) => {
  try {
    const filter = req.body.filter || {};
    const sort = req.body.sort || '-created_date';
    const limit = parseInt(req.body.limit) || 50;

    const moduloz = await Modulo.find(filter)
      .sort(sort)
      .limit(limit);
    res.json(moduloz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getModulo = async (req, res) => {
  try {
    const modulo = await Modulo.findById(req.params.id);
    if (!modulo) {
      return res.status(404).json({ message: 'Modulo not found' });
    }
    res.json(modulo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createModulo = async (req, res) => {
  try {
    // Only admins can create modules
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const modulo = await Modulo.create({
      ...req.body,
      created_by: req.user.email
    });
    res.status(201).json(modulo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateModulo = async (req, res) => {
  try {
    // Only admins can update modules
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const modulo = await Modulo.findById(req.params.id);
    if (!modulo) {
      return res.status(404).json({ message: 'Modulo not found' });
    }

    Object.assign(modulo, req.body);
    modulo.updated_date = Date.now();
    await modulo.save();

    res.json(modulo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteModulo = async (req, res) => {
  try {
    // Only admins can delete modules
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const modulo = await Modulo.findById(req.params.id);
    if (!modulo) {
      return res.status(404).json({ message: 'Modulo not found' });
    }

    await modulo.deleteOne();
    res.json({ message: 'Modulo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};