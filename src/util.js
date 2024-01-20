// Função para calcular a distância dos pontos
export const calcularDistancias = (pontoA, pontoB) => {
  return Math.sqrt((pontoA.x - pontoB.x) ** 2 + (pontoA.y - pontoB.y) ** 2)
}

//* ----------------------------------------------------------------------------------------------------- //

// Função para calcular a distância total de uma rota
export const calcularDistanciaTotal = (rota) => {
  let distanciaTotal = 0
  // Laço para percorrer a rota
  for (let i = 0; i < rota.length - 1; i++) {
    distanciaTotal += calcularDistancias(rota[i], rota[i + 1])
  }

  return distanciaTotal
}
