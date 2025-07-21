const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Game = require('../models/Game');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

// @route   GET api/games
// @desc    Get all games for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Try to get from cache first
    const cacheKey = `games:${req.user.id}`;
    const cachedGames = await redis.get(cacheKey);
    
    if (cachedGames) {
      return res.json(JSON.parse(cachedGames));
    }

    const games = await Game.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']]
    });

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(games));
    
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/games/:id
// @desc    Get a specific game
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }

    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/games
// @desc    Create a new game
// @access  Private
router.post('/', [
  auth,
  check('title', 'Title is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, pieces, rules } = req.body;

    const game = await Game.create({
      title,
      pieces: pieces || [],
      rules: rules || '',
      userId: req.user.id
    });

    // Invalidate cache
    await redis.del(`games:${req.user.id}`);

    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/games/:id
// @desc    Update a game
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, pieces, rules } = req.body;

    let game = await Game.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }

    game = await game.update({
      title: title || game.title,
      pieces: pieces || game.pieces,
      rules: rules || game.rules
    });

    // Invalidate cache
    await redis.del(`games:${req.user.id}`);

    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/games/:id
// @desc    Delete a game
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const game = await Game.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!game) {
      return res.status(404).json({ msg: 'Game not found' });
    }

    await game.destroy();

    // Invalidate cache
    await redis.del(`games:${req.user.id}`);

    res.json({ msg: 'Game removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 