function status(request, response) {
  response.status(200).json({ chave: "oi joao" });
}

export default status;
