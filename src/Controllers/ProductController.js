const product = require('../Models/Product');
const User = require('../Models/User');

module.exports = {
  async create(req, res) {

    const { name, price } = req.body
    const { user_id } = req.params
    const { auth } = req.headers

    if (user_id !== auth) {
      return res.status(400).send({ message: 'Unauthorized' })
    }

    const randomNumberOrder = Math.floor((Math.random() * 1000) + 1)

    try {
      const userInfo = await User.findById(user_id)
      const { location } = userInfo


      const longitude = location.coordinates[0]
      const latitude = location.coordinates[1]
      const setLocation = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      const createdProduct = await product.create({
        name,
        price,
        user: user_id,
        location: setLocation,
        order: randomNumberOrder
      })

      await createdProduct.populate('user').execPopulate()

      return res.status(201).send(createdProduct)

    } catch (err) {
      return res.status(400).send(err)
    }

  },

  async delete(req, res) {
    const { product_id, user_id } = req.params
    const { auth } = req.headers

    if (user_id !== auth) {
      return res.status(400).send({ message: 'Unauthorized' })
    }

    try {
      const deletedProduct = await product.findByIdAndDelete(product_id)

      return res.status(200).send({ status: "deleted", user: deletedProduct })

    } catch (err) {
      return res.status(400).send(err)
    }
  },

  async indexByUser(req, res) {
    const { user_id } = req.params
    const { auth } = req.headers

    if (user_id !== auth) {
      return res.status(400).send({ message: 'Unauthorized' })
    }

    try {
      const findAllProductsOfAUser = await product.find({
        user: user_id
      }).populate('user')

      return res.status(200).send(findAllProductsOfAUser)
    } catch (err) {
      return res.status(400).send(err)
    }
  },

  async indexAll(req, res) {
    const { longitude, latitude } = req.query

    const maxDistance = 5000

    try {

      const allProducts = await product.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        }
      }).populate('user').limit(20).sort('order')

      return res.status(200).send(allProducts)

    } catch (err) {
      return err
    }
  }
}