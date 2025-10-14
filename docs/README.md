<!--API Produtos-->


## API Reference

### Produtos

#### GET/produtos
-**Descrição**: Obtém uma lista de produtos 
-**Response**: Array de produtos

#### POST/produtos 
-**Descrição**: Cria um novo produto
-**Body**: 
```
{
    "nomeProduto": "produto exemplo".
    "precoProduto": 0.00
}
```
-**Response**: 
```
{
    "message": "Produto cadastrado com sucesso!"
}
```


<!--API Clientes-->


## API Reference

### Produtos

#### GET/produtos
-**Descrição**: Obtém uma lista de clientes 
-**Response**: Array de produtos

#### POST/produtos 
-**Descrição**: Cadastra um novo Cliente
-**Body**: 
```
{
    "nomeCliente": "nome exemplo".
    "cpfCliente": 12345678910
}
```
-**Response**: 
```
{
    "message": "Cliente cadastrado com sucesso!"
}
```