import uuid from 'uuid/v4'
import moment from 'moment'
import Joi from 'joi'
import { validate } from './ordervalidate'

function orderToDo(order) {
    order.id = order._id
    delete order._id
    return order
}

const orderUpdateSchema = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    category: Joi.string().required(),
    m3: Joi.number(),
    weight: Joi.number(),
    price: Joi.string().required(),
//    offer: Joi.number(), kai bus driveris
    startDate: Joi.date().iso().required(),
    locationAdress: Joi.object().keys({
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        house: Joi.string().required(),
        flat: Joi.string()
    }).required(),
    destinationAdress: Joi.object().keys({
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        house: Joi.string().required(),
        flat: Joi.string(),
        contact: Joi.string()
    }).required()
    //Distance: Joi.number()
})

const orderCreateSchema = orderUpdateSchema.keys({
    customerId: Joi.string().required(),
})

export function register(server, orderStorage){
    server.post('/orders', validate(orderCreateSchema), function(req, resp, next){
        orderStorage.saveOrder(req.body)
            .then(function(order) {
                resp.status(201)
                resp.header('Location', '/orders/' + order._id)
                resp.send(orderToDo(order))
                next()
            })
    })
//
//
    server.post('/orders/edit/:id', validate(orderUpdateSchema), function(req, resp, next){
        orderStorage.updateOrder(req.params.id, req.body)
            .then(function() {
                console.log(req.body)
                return orderStorage.getOrderbyId(req.params.id)
            })
            .then(function(order) {
                if (!order){
                    resp.status(404)
                    resp.send({message: 'Order with id '+req.params.id + ' was not found...'})
                } else {
                    resp.send(orderToDo(order))
                }
                next()
            })
    })

    server.get('/orders/:id', function( req, resp, next){
        orderStorage.getOrderbyId(req.params.id)
            .then(function(order){
                if (!order){
                    resp.status(404)
                    resp.send({message: 'Order with id '+req.params.id + 'was not found...'})
                } else {
                    resp.send(orderToDo(order))
                }
                next()
            })
    })

    
    server.del('/orders/:id', function(req, resp, next) {
        orderStorage.removeOrder(req.params.id)
            .then(function() {
                resp.status(204)
                resp.end()
                next()
            })
    })

    server.get('/orders', function(req, resp, next) {
        orderStorage.listOrders(req.query)
            .then(function(orders) {
                resp.send(orders.map(orderToDo))
                next()
            })
    })
}
