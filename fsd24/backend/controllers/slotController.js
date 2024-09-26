const Slot = require('../models/Slot');
const Movie = require('../models/Movie');
const Screen = require('../models/Screen');
const Theatre = require('../models/Theatre');
exports.createSlot = async (req, res) => {
    const { movieId, theatreId, time, date, screenId } = req.body;
  
    try {
      const movie = await Movie.findById(movieId);
      const theatre = await Theatre.findById(theatreId);
      const screen = await Screen.findById(screenId);
  
      if (!movie || !theatre || !screen) {
        return res.status(404).send({ message: 'Movie, Theatre, or Screen not found' });
      }
  
      const slot = new Slot({
        movie: movieId,
        theatre: theatreId,
        time,
        date,
        screen: screenId,
      });
      console.log('slot created')
      const savedslot = await slot.save();
      console.log(savedslot)
      res.status(201).send(slot);
    } catch (error) {
      console.log(error)
      res.status(400).send(error);
    }
  };
  

// exports.getSlots = async (req, res) => {
//   try {
//     const slots = await Slot.find();
//     res.status(200).send(slots);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };
exports.getSlotsbyQuery = async (req, res) => {
  try {
    const { movieId, theatreId } = req.query; // Get IDs from query parameters

    // Fetch the slots based on the provided IDs
    let slots = await Slot.find({
      movie: movieId,
      theatre: theatreId
    });

    res.status(200).send(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).send(error);
  }
};

exports.getSlots = async (req, res) => {
  try {
    const slots = await Slot.find();
    res.status(200).send(slots);
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.getSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).send({ message: 'Slot not found' });
    }
    res.status(200).send(slot);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slot) {
      return res.status(404).send({ message: 'Slot not found' });
    }
    res.status(200).send(slot);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    const slotId = req.params.id;
    const deletedSlot = await Slot.findByIdAndDelete(slotId);
    if (!deletedSlot) {
      return res.status(404).send({ message: 'Slot not found' });
    }
    res.status(200).send({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};
