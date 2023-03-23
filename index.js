/* Algumas coisas mudaram, de acordo com minhas pesquisas e a documentação, a partir da versão 16.10 do node foi implementada 
uma nova ferramenta para ajudar no gerenciamento de versões dos gerenciadores de pacotes(assim como o nvm ajuda no gerenciamento 
de versões do node), chamada corepack, que já trás o yarn instalado por padrão. atualmente ela é opicional, portanto é preciso 
habilitá-la com $corepack enable. para versões do node anteriores a 16.10, a maneira recomendada para instalá-lo é instalar o 
corepack, que já o trás por padrão, com $npm i -g corepack e posteriormente habilitá-lo com $corepack enable. reabrindo o terminal 
e executando $yarn -v, pode-se confirmar que o yarn está instalado. */

const port = 3001
const { response, request } = require('express')
const uuid = require('uuid')
const bodyParser = require('body-parser')
const cors = require('cors')

const express = require('express')

const app = express()
app.use(bodyParser.json())
app.use(cors())


const arrayOrder = []

const typeRequisition = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)
  
    next()
  }

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = arrayOrder.findIndex(user => user.id === id)
    
    if (index < 0) {
        return response.status(404).json({ message: "order not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

// app.use(checkOrderId)

app.get('/orders', typeRequisition, (request, response) => {

    return response.status(200).json(arrayOrder)
  })


app.post('/orders', typeRequisition, (request, response) => {
    const { name, requisition, price } = request.body

    const orderClient = { id:uuid.v4(), name, requisition, price, "status": "Em preparação" }

    arrayOrder.push(orderClient)

    return response.status(201).json(orderClient)
})

app.put('/orders/:id', checkOrderId, typeRequisition, (request, response) => {
    const {name, requisition, price } = request.body
    const index = request.userIndex
    const id = request.userId

    const upDateOrder = { id, name, requisition, price, "status": "Em preparação" }

    arrayOrder[index] = upDateOrder
    console.log(index)

    return response.json(upDateOrder)
})

app.delete('/orders/:id', checkOrderId, typeRequisition, (request, response) => {
    const index = request.userIndex

    arrayOrder.splice(index, 1)

    return response.status(202).json({ message: "Pedido cancelado"})
})


app.patch('/orders/:id', checkOrderId, typeRequisition, (request, response) => {

    const index = request.userIndex

    arrayOrder[index].status = "Pronto"

    return response.status(200).json(arrayOrder[index])
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})