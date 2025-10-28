const Vote = require('../models/Vote');

exports.submitVote = async (req, res) => {
  try {
    const { userName, userEmail, filmId, filmTitle } = req.body;

    const vote = new Vote({ userName, userEmail, filmId, filmTitle });
    await vote.save();

    res.status(201).json({ success: true, message: 'Vote submitted successfully' });
  } catch (error) {
    if(error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Vous avez déjà voté pour ce film !' });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur: ' + error.message });
  }
};

exports.getVotes = async (req, res) => {
  try {
    const voteCounts = await Vote.aggregate([
      { $group: { _id: '$filmId', count: { $sum: 1 }, filmTitle: { $first: '$filmTitle' } } }
    ]);
    res.json({ success: true, data: voteCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur: ' + error.message });
  }
};


