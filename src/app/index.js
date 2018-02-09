import * as restify from 'restify'
import { MongoClient } from 'mongodb'
import restifyCorsMiddleware from 'restify-cors-middleware'
import { MongoOrderStorage } from './orders/orderstorage'
import * as ordersApi from './orders/api'

const mongoUrl = 'mongodb://localhost:27017'
MongoClient.connect(mongoUrl, function(error, mongoClient){
    const cors = restifyCorsMiddleware({
        origins: ['*']
    })

    const server = restify.createServer()
    server.pre(cors.preflight)
    server.use(cors.actual)
    server.use(restify.plugins.bodyParser())
    server.use(restify.plugins.queryParser())

    ordersApi.register(server, new MongoOrderStorage(mongoClient))

    server.listen(8888, ()=> {
        console.log('%s listenin at %s', server.name, server.url);
    })
})
