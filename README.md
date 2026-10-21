# API de Pets 🐾

API REST simples para gerenciamento de pets de um abrigo, desenvolvida com **Node.js** e **Express**. Os dados ficam armazenados em memória (um array), então são reiniciados sempre que o servidor é reiniciado.

## Tecnologias

- Node.js
- Express

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)

### Passo a passo

```bash
# 1. Instalar as dependências
npm install express

# 2. Garantir que o package.json tenha o suporte a ES Modules
#    (o código usa "import")
#    "type": "module"

# 3. Iniciar o servidor
node index.js
```

O servidor ficará disponível em: `http://localhost:3000`

> Se o arquivo principal tiver outro nome, troque `index.js` pelo nome correto.

## Modelo de dados

Cada pet possui os seguintes campos:

| Campo        | Tipo      | Descrição                          |
|--------------|-----------|------------------------------------|
| `idPet`      | `number`  | Identificador único (gerado pela API) |
| `dsNome`     | `string`  | Nome do pet                        |
| `dsEspecie`  | `string`  | Espécie (ex.: cachorro, gato)      |
| `nuIdade`    | `number`  | Idade do pet (maior ou igual a 0)  |
| `fgAdotado`  | `boolean` | Indica se o pet já foi adotado     |

Exemplo:

```json
{
  "idPet": 1,
  "dsNome": "Rex",
  "dsEspecie": "cachorro",
  "nuIdade": 3,
  "fgAdotado": false
}
```

## Endpoints

| Método   | Rota            | Descrição                    |
|----------|-----------------|------------------------------|
| `GET`    | `/`             | Rota raiz (teste da API)     |
| `GET`    | `/pets`         | Lista todos os pets          |
| `GET`    | `/pets/:idPet`  | Busca um pet pelo ID         |
| `POST`   | `/pets`         | Cadastra um novo pet         |
| `PATCH`  | `/pets/:idPet`  | Atualiza parcialmente um pet |
| `DELETE` | `/pets/:idPet`  | Remove um pet                |

---

### `GET /`

Retorna o texto `rota raiz`.

---

### `GET /pets`

Retorna a lista com todos os pets.

**Resposta (200):**

```json
[
  {
    "idPet": 1,
    "dsNome": "Rex",
    "dsEspecie": "cachorro",
    "nuIdade": 3,
    "fgAdotado": false
  }
]
```

---

### `GET /pets/:idPet`

Retorna um pet específico.

**Respostas:**

| Status | Quando acontece                    | Corpo                                                   |
|--------|------------------------------------|---------------------------------------------------------|
| `200`  | Pet encontrado                     | Objeto do pet                                           |
| `400`  | `idPet` não é um número válido     | `{ "mensagem": "o parametro deve ser um numero valido" }` |
| `404`  | Pet não encontrado                 | Sem corpo                                               |

---

### `POST /pets`

Cadastra um novo pet. O `idPet` é gerado automaticamente e `fgAdotado` começa como `false`.

**Corpo da requisição:**

```json
{
  "dsNome": "Mia",
  "dsEspecie": "gato",
  "nuIdade": 2
}
```

**Regras de validação:**

- `dsNome` e `dsEspecie` são obrigatórios.
- `nuIdade` é obrigatório, deve ser numérico e maior ou igual a 0.

**Respostas:**

| Status | Quando acontece                          | Corpo                                                           |
|--------|------------------------------------------|-----------------------------------------------------------------|
| `201`  | Pet criado com sucesso                   | Objeto do pet criado                                            |
| `400`  | Nome ou espécie ausentes                 | `{ "mensagem": "dados faltando, verifique nome e especie" }`    |
| `400`  | Idade ausente, inválida ou negativa      | `{ "mensagem": "idade faltando ou escrita incorreta" }`         |

**Exemplo de resposta (201):**

```json
{
  "idPet": 2,
  "dsNome": "Mia",
  "dsEspecie": "gato",
  "nuIdade": 2,
  "fgAdotado": false
}
```

---

### `PATCH /pets/:idPet`

Atualiza um ou mais campos de um pet. Só é necessário enviar os campos que deseja alterar.

**Corpo da requisição (todos os campos são opcionais, mas ao menos um é obrigatório):**

```json
{
  "dsNome": "Rex Jr.",
  "dsEspecie": "cachorro",
  "nuIdade": 4,
  "fgAdotado": true
}
```

**Regras de validação:**

- `dsNome` e `dsEspecie`, se enviados, não podem ser vazios.
- `nuIdade`, se enviada, deve ser numérica e maior ou igual a 0.
- `fgAdotado`, se enviado, deve ser `true` ou `false` (booleano).
- Ao menos um campo deve ser enviado.

**Respostas:**

| Status | Quando acontece                          | Corpo                                                         |
|--------|------------------------------------------|---------------------------------------------------------------|
| `200`  | Pet atualizado                           | Objeto do pet atualizado                                      |
| `400`  | `idPet` inválido                         | `{ "mensagem": "o parametro deve ser um numero valido" }`     |
| `400`  | Nome vazio                               | `{ "mensagem": "nome nao pode ser vazio" }`                   |
| `400`  | Espécie vazia                            | `{ "mensagem": "especie nao pode ser vazia" }`                |
| `400`  | Idade inválida                           | `{ "mensagem": "idade escrita incorretamente" }`              |
| `400`  | `fgAdotado` não é booleano               | `{ "mensagem": "fgAdotado deve ser true ou false" }`          |
| `400`  | Nenhum campo enviado                     | `{ "mensagem": "envie ao menos um campo para atualizar" }`    |
| `404`  | Pet não encontrado                       | Sem corpo                                                     |

---

### `DELETE /pets/:idPet`

Remove um pet pelo ID.

**Respostas:**

| Status | Quando acontece                | Corpo                                                     |
|--------|--------------------------------|-----------------------------------------------------------|
| `204`  | Requisição processada          | Sem corpo                                                 |
| `400`  | `idPet` inválido               | `{ "mensagem": "o parametro deve ser um numero valido" }` |

> **Observação:** nesta versão, a rota retorna `204` mesmo quando o ID não existe. A verificação que retornaria `404` para IDs inexistentes está implementada em comentário no código, para ser ativada na próxima etapa.

---

## Exemplos de uso com cURL

```bash
# Listar todos os pets
curl http://localhost:3000/pets

# Buscar o pet de ID 1
curl http://localhost:3000/pets/1

# Criar um pet
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -d '{"dsNome": "Mia", "dsEspecie": "gato", "nuIdade": 2}'

# Marcar o pet 1 como adotado
curl -X PATCH http://localhost:3000/pets/1 \
  -H "Content-Type: application/json" \
  -d '{"fgAdotado": true}'

# Remover o pet 1
curl -X DELETE http://localhost:3000/pets/1
```

## Estrutura do código

O arquivo está organizado em funções de acesso aos dados e rotas:

| Função         | Responsabilidade                                   |
|----------------|----------------------------------------------------|
| `buscar_todos` | Retorna todos os pets                              |
| `buscar_um`    | Busca um pet pelo ID                               |
| `criar_pet`    | Cria um pet e incrementa o `ultimoId`              |
| `editar_pet`   | Atualiza apenas os campos informados               |
| `deletar`      | Remove um pet do array                             |

## Observações

- Os dados são armazenados **em memória**: ao reiniciar o servidor, voltam ao estado inicial (apenas o pet "Rex").
- A porta utilizada é a `3000`.
- As respostas de erro de validação usam o formato `{ "mensagem": "..." }`.

## Autor

Desenvolvido por **[seu nome]** como parte de avaliação de Backend.
