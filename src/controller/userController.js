import { userErrors, userMessage } from '../constants/user.js'
import { generateUserName } from '../utils/generateUserName.js'

export const register = async (req, res) => {
  try {
    const {
      context: {
        models: { User },
      },
      body,
    } = req

    const { email } = body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(500).send({ message: userErrors.ALREADY_EXISTS })
    }

    const user = await User.create({
      ...body,
      userName: generateUserName(email),
    })

    if (!user) {
      return res.status(500).send({ message: userErrors.SOMETHING_WENT_WRONG })
    }

    const createdUser = await User.findOne({ email: user?.email }).select(
      '-password'
    )
    res.status(201).send({ message: userMessage.REGISTERED, user: createdUser })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const login = async (req, res) => {
  try {
    const {
      context: {
        models: { User },
      },
      body,
    } = req

    const { email, password } = body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(500).send({ message: userErrors.USER_NOT_FOUND })
    }

    const passwordCorrect = user?.isPasswordCorrect(password)
    if (!passwordCorrect) {
      return res.status(500).send({ message: userErrors.INVALID_CREDENTIALS })
    }
    const token = await user?.generateJwtToken()
    res.status(201).send({ token })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const update = async (req, res) => {
  try {
    const {
      context: {
        models: { User },
      },
      user,
      body,
    } = req

    const updatedUser = await User.findByIdAndUpdate(user?._id, body, {
      new: true,
    })

    if (!updatedUser) {
      return res.status(500).send({ message: userErrors.SOMETHING_WENT_WRONG })
    }

    res.status(201).send({ message: userMessage.UPDATED, updatedUser })
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}

export const currentUser = async (req, res) => {
  try {
    const { user } = req
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
}
