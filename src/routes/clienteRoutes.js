const express = require("express");
const router = express.Router();
const {clienteController} = require("../controllers/clienteController");

//GET /clientes -> Lista todos os Clientes
router.get("/clientes", clienteController.listarClientes);

//POST /clientes -> Cadastra um novo Cliente
router.post("/clientes", clienteController.adicionarCliente);

module.exports = { clienteRoutes: router};