// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// exports.registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if user already exists
//     let existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create and save new user
//     const user = new User({ username, email, password });
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     // Return response with token and user data
//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     // Handle any errors during registration
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// };

// // exports.loginUser = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     // Find user by email
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     // Check password match
// //     const isMatch = await user.comparePassword(password);
// //     if (!isMatch) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign(
// //       { id: user._id },
// //       process.env.JWT_SECRET,
// //       { expiresIn: '1d' }
// //     );

// //     // Return response with token and user data
// //     res.json({
// //       token,
// //       user: {
// //         id: user._id,
// //         username: user.username,
// //         email: user.email
// //       }
// //     });
// //   } catch (error) {
// //     // Handle any errors during login
// //     console.error('Login error:', error);
// //     res.status(500).json({ message: 'Server error during login' });
// //   }
// // };

// exports.getUserProfile = async (req, res) => {
//   try {
//     // Find the user by ID and exclude the password
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ message: 'Server error fetching profile' });
//   }
// };







// // const jwt = require('jsonwebtoken');
// // const User = require('../models/User'); // Make sure the path is correct

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     // Use comparePassword method to compare the entered password with the stored password
//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ id: user._id },process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Return the token in the response
//     // res.json({
//     //   message: 'Login successful',
//     //   token,
//     // });
//     res.status(201).json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email
//       }
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
