# API de Pets 🐾

API REST simples para gerenciamento de pets de um abrigo, desenvolvida com **Node.js** e **Express**. Os dados ficam armazenados em memória (um array), então são reiniciados sempre que o servidor é reiniciado.

## Tecnologias

- Node.js
- Express

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)
- [Postman](https://www.postman.com/) para testar as rotas

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

## Testando no Postman

Com o servidor rodando (`node index.js`), abra o Postman e crie uma nova requisição para cada rota abaixo.

> Nas rotas com corpo (`POST` e `PATCH`), vá na aba **Body**, marque **raw** e escolha o formato **JSON** no menu à direita. O Postman adiciona o header `Content-Type: application/json` automaticamente.

### 1. Listar todos os pets

- **Método:** `GET`
- **URL:** `http://localhost:3000/pets`
- **Body:** nenhum
- **Resultado esperado:** status `200 OK` com a lista de pets.

### 2. Buscar um pet pelo ID

- **Método:** `GET`
- **URL:** `http://localhost:3000/pets/1`
- **Body:** nenhum
- **Resultado esperado:** status `200 OK` com o pet de ID 1.
- **Testes de erro:**
  - `http://localhost:3000/pets/abc` → `400 Bad Request`
  - `http://localhost:3000/pets/999` → `404 Not Found`

### 3. Criar um pet

- **Método:** `POST`
- **URL:** `http://localhost:3000/pets`
- **Body** (raw → JSON):

```json
{
  "dsNome": "Mia",
  "dsEspecie": "gato",
  "nuIdade": 2
}
```

- **Resultado esperado:** status `201 Created` com o pet criado.
- **Teste de erro:** envie o body sem `dsNome` → `400 Bad Request`.

### 4. Atualizar um pet

- **Método:** `PATCH`
- **URL:** `http://localhost:3000/pets/1`
- **Body** (raw → JSON):

```json
{
  "fgAdotado": true
}
```

- **Resultado esperado:** status `200 OK` com o pet atualizado.
- **Testes de erro:**
  - Body vazio `{}` → `400 Bad Request`
  - `"fgAdotado": "sim"` → `400 Bad Request`
  - ID inexistente (ex.: `/pets/999`) → `404 Not Found`

### 5. Remover um pet

- **Método:** `DELETE`
- **URL:** `http://localhost:3000/pets/1`
- **Body:** nenhum
- **Resultado esperado:** status `204 No Content` (sem corpo na resposta).
- **Teste de erro:** `http://localhost:3000/pets/abc` → `400 Bad Request`.

> Depois de remover, faça um `GET /pets/1` para confirmar que o pet não existe mais (`404 Not Found`).

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
