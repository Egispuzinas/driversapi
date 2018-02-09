import uuid from 'uuid/v4'
import moment from 'moment'

export class MongoOrderStorage {
    constructor(mongoClient) {
        this.orderCollection = mongoClient.db('freedriver')
            .collection('orders')
    }

    saveOrder(order) {
        order._id = uuid()
        order.startDate = moment(order.startDate).toDate()

        return this.orderCollection.save(order)
            .then(function(){
                return order
            })
    }

    updateOrder(id, order){
        const update = {
            '$set' : order
        }

        return this.orderCollection
            .update({_id: id}, update)
    }

    getOrderbyId(id) {
        return this.orderCollection
            .findOne({ _id: id})
    }

    removeOrder(id) {
        return this.orderCollection
            .deleteOne({ _id: id })
    }

    listOrders() {
        return this.orderCollection.find().toArray()
    }

}
