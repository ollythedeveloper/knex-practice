const { Knex } = require('knex')

const ShoppingListService = {
    getAllProducts(knex) {
        return knex.select('*').from('shopping_list')
    },
    insertProduct(knex, newProdcut) {
        return knex
            .insert(newProdcut)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('shopping_list').select('*').where('id', id).first()
    },
    deleteProduct(knex, id) {
        return knex('shopping_list')
            .where({ id })
            .delete()
    },
    updateProduct(knex, id, newProdcutFields) {
        return knex('shopping_list')
            .where({ id })
            .update(newProdcutFields)
    }
}

module.exports = ShoppingListService