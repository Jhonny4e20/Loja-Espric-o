<!--API Produtos-->


## API Produtos

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
#### DELETE/produtos
-**Descrição**: Deleta um produto já existente
-**Response**:
```
{
    "message": "Produto deletado com sucesso!"
}
```
#### PUT/produtos
-**Descrição**: Atualiza um produto já existente
-**Body**:
```
{
    "nomeProduto": "produto exemplo atualizado".
    "precoProduto": 0.00
}
```
-**Response**:
```
{
    "message": "Produto atualizado com sucesso!"
}
```

<!--API Clientes-->


## API Clientes

### Clientes

#### GET/clientes
-**Descrição**: Obtém uma lista de clientes 
-**Response**: Array de produtos

#### POST/clientes 
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