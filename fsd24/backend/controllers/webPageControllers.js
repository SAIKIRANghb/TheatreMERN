const WebPage = require('../models/WebPage');

// Create a new webpage entry
exports.createWebPage = async (req, res) => {
  try {
    const newWebPage = new WebPage(req.body);
    await newWebPage.save();
    res.status(201).json(newWebPage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all webpages
exports.getWebPages = async (req, res) => {
  try {
    const webPages = await WebPage.find();
    res.status(200).json(webPages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a webpage by ID
exports.getWebPageById = async (req, res) => {
  try {
    const webPage = await WebPage.findById(req.params.id);
    if (!webPage) return res.status(404).json({ message: 'WebPage not found' });
    res.status(200).json(webPage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a webpage
exports.updateWebPage = async (req, res) => {
  try {
    const updatedWebPage = await WebPage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWebPage) return res.status(404).json({ message: 'WebPage not found' });
    res.status(200).json(updatedWebPage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a webpage
exports.deleteWebPage = async (req, res) => {
  try {
    const webPage = await WebPage.findById(req.params.id);
    if (!webPage) return res.status(404).json({ message: 'WebPage not found' });
    await webPage.remove();
    res.status(200).json({ message: 'WebPage deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
