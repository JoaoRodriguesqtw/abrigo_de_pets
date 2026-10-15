import express from "express";


//banco de dados
const pets = [{
  "idPet": 1, "dsNome": "Rex",  "dsEspecie": "cachorro","nuIdade": 3, "fgAdotado": false}
]

let ultimoId = 1;



const app = express(); //Primeiro pilar: instancia do express
const PORT = 3000;

app.use(express.json());


app.get("/", (req, res) => {
  res.send("rota raiz");
});



function buscar_todos(req,res){
return pets
}

app.get("/pets",(req,res)=>{

    const todos_os_pets = buscar_todos();
    res.json(todos_os_pets);
})


function buscar_um(id){
    let pet = pets.find((pet) => {
        return pet.idPet === id;
    });
    return pet; }

app.get("/pets/:idPet", (req, res) => {
    const id = parseInt(req.params.idPet);

    if (isNaN(id)){
        return res
            .status(400)
            .json({mensagem: "o parametro deve ser um numero valido"});
    }

    let pet = buscar_um(id);

    if (!pet) {
        return res.status(404).send();
    }

    res.json(pet);
});

function criar_pet(nome, especie, idade){
   ultimoId++;

  let novo_pet = {
    idPet: ultimoId,
    dsNome: nome,
    dsEspecie: especie,
    nuIdade: idade,
    fgAdotado: false,
  };

  pets.push(novo_pet);
  return novo_pet;
}
app.post("/pets",(req,res)=>{
  const nome = req.body.dsNome;
  const especie = req.body.dsEspecie;
  const idade = req.body.nuIdade;

  if (!nome || !especie) {
    return res
      .status(400)
      .json({ mensagem: "dados faltando, verifique nome e especie" });
  }

  if (idade === undefined || isNaN(idade) || idade < 0) {
    return res
      .status(400)
      .json({ mensagem: "idade faltando ou escrita incorreta" });
  }

  const novo_pet = criar_pet(nome, especie, Number(idade));

  res.status(201).json(novo_pet);
})

function editar_pet(id, nome, especie, idade,adotado){
  const pet = pets.find((pet) => pet.idPet === id);

  if (!pet) {
    return undefined;
  }

  if (nome !== undefined) {
    pet.dsNome = nome;
  }

  if (especie !== undefined) {
    pet.dsEspecie = especie;
  }

  if (idade !== undefined) {
    pet.nuIdade = Number(idade);
  }

  if (adotado !== undefined) {
    pet.fgAdotado = adotado;
  }

  return pet;
}

app.patch("/pets/:idPet",(req,res)=>{
   const id = parseInt(req.params.idPet);

  if (isNaN(id)) {
    return res
      .status(400)
      .json({ mensagem: "o parametro deve ser um numero valido" });
  }

  const nome = req.body.dsNome;
  const especie = req.body.dsEspecie;
  const idade = req.body.nuIdade;
  const adotado = req.body.fgAdotado;

  if (nome !== undefined && !nome) {
    return res.status(400).json({ mensagem: "nome nao pode ser vazio" });
  }

  if (especie !== undefined && !especie) {
    return res.status(400).json({ mensagem: "especie nao pode ser vazia" });
  }

  if (idade !== undefined && (isNaN(idade) || idade < 0)) {
    return res.status(400).json({ mensagem: "idade escrita incorretamente" });
  }

  if (adotado !== undefined && typeof adotado !== "boolean") {
    return res
      .status(400)
      .json({ mensagem: "fgAdotado deve ser true ou false" });
  }

  if (
    nome === undefined &&
    especie === undefined &&
    idade === undefined &&
    adotado === undefined
  ) {
    return res
      .status(400)
      .json({ mensagem: "envie ao menos um campo para atualizar" });
  }


  const pet_atualizado = editar_pet(id, nome, especie, idade, adotado);

  if (!pet_atualizado) {
    return res.status(404).send();
  }

  res.json(pet_atualizado);
});

function deletar(id){
const index_pet = pets.findIndex((pet) => pet.idPet === id);

if (index_pet !== -1){
  pets.splice(index_pet, 1);
}
}

app.delete("/pets/:idPet",(req,res)=>{
    const id = parseInt(req.params.idPet);

    if (isNaN(id)) {
    return res
      .status(400)
      .json({ mensagem: "o parametro deve ser um numero valido" });
  }


     deletar(id)
    res.status(204).send();
})




app.listen(PORT); // porta a ser ouvida