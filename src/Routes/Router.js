const { Router } = require('express');
const ProductController = require('../Controllers/ProductController');
const SessionControle = require('../Controllers/SessionControle');
const UserController = require('../Controllers/UserController')

const routes = Router()

routes.post('/user', UserController.create)
routes.delete('/user/:user_id', UserController.delete)
routes.get('/user', UserController.index)

routes.post('/session', SessionControle.create)

routes.post('/:user_id/product', ProductController.create)
routes.delete('/:user_id/product/:product_id', ProductController.delete)
routes.get('/product', ProductController.indexAll)
routes.get('/product/:user_id', ProductController.indexByUser)
module.exports = routes;