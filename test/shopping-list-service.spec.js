const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')
const { expect } = require("chai")

describe(`ShoppingListService object`, function() {
    let db
    let testShoppingList = [
        {
            id:1,
            name: 'Fisrt test product!',
            price: '1.11',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category:'Snack'
        },
        {
            id: 2,
            name: 'Second test product',
            price: '2.22',
            date_added: new Date('2100-05-22T16:28:32.615Z'),
            checked: false,
            category: 'Snack'
        },
        {
            id: 3,
            name: 'Third test product',
            price: '3.33',
            date_added: new Date('1919-12-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast'
        }
    ]

    before(() => {
        db = knex({
            client:'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testShoppingList)
        })
        
        it(`getAllProducts() resolves all products from the 'shopping_list' table`, () => {
            // test that ShoppingListService.getAllProducts gets data from table
            return ShoppingListService.getAllProducts(db)
                .then(actual => {
                    expect(actual).to.eql(testShoppingList)
                })
        })

        it(`getById() resolves a product by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestProduct = testShoppingList[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: thirdId,
                        name: thirdTestProduct.name,
                        price: thirdTestProduct.price,
                        date_added: thirdTestProduct.date_added,
                        checked: thirdTestProduct.checked,
                        category: thirdTestProduct.category
                    })
                })
        })

        it(`deleteProduct() removes a product by id from 'shopping_list' table`, () => {
            const productId = 2
            return ShoppingListService.deleteProduct(db, productId)
                .then(() => ShoppingListService.getAllProducts(db))
                .then(allProducts => {
                    //copy the test products array without the "deleted" product
                    const expected = testShoppingList.filter(product => product.id !== productId)
                    expect(allProducts).to.eql(expected)
                })
        })

        it(`updateProduct() updates a product from the 'shopping_list' table`, () => {
            const idOfProductToUpdate = 2
            const newProductData = {
                name: 'updated product name',
                price: '3.22',
                date_added: new Date(),
                checked: true,
                category: 'Snack'
            }
            return ShoppingListService.updateProduct(db, idOfProductToUpdate, newProductData)
                .then(() => ShoppingListService.getById(db, idOfProductToUpdate))
                .then(product => {
                    expect(product).to.eql({
                        id: idOfProductToUpdate,
                        ...newProductData,
                    })
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllProducts() resolves an empty array`, () => {
            return ShoppingListService.getAllProducts(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })

        })
        it(`insertProduct() inserts a new product and resolves the new product with an 'id'`, () => {
            const newProduct = {
                name: 'Test new product!',
                price: '4.11',
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                checked: false,
                category:'Lunch'
            }
            return ShoppingListService.insertProduct(db, newProduct)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newProduct.name,
                        price: newProduct.price,
                        date_added: new Date(newProduct.date_added),
                        checked: newProduct.checked,
                        category: newProduct.category
                    })
                })
        })
    })
})