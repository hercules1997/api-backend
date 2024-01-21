function calcularDistancia(ponto1, ponto2) {
  const distancia = Math.sqrt(
    Math.pow(ponto2[0] - ponto1[0], 2) + Math.pow(ponto2[1] - ponto1[1], 2)
  )

  return distancia
}

function encontrarPontoMaisProximo(pontoAtual, pontos, visitados) {
  let distanciaMinima = Number.MAX_VALUE
  let pontoMaisProximo = -1

  for (let i = 0; i < pontos.length; i++) {
    if (!visitados[i]) {
      const distancia = calcularDistancia(pontoAtual, pontos[i])
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia
        pontoMaisProximo = i
      }
    }
  }

  return pontoMaisProximo
}

export function encontrarRotaMenorDistancia(pontos) {
  const quantidadePontos = pontos.length
  let rota = []
  let visitados = new Array(quantidadePontos).fill(false)

  let pontoAtual = 0 // Começando no ponto (0, 0)
  visitados[pontoAtual] = true
  rota.push(pontos[pontoAtual])

  for (let i = 0; i < quantidadePontos - 1; i++) {
    let pontoMaisProximo = encontrarPontoMaisProximo(
      pontos[pontoAtual],
      pontos,
      visitados
    )

    visitados[pontoMaisProximo] = true
    rota.push(pontos[pontoMaisProximo])
    pontoAtual = pontoMaisProximo
  }

  // Adicionando o ponto inicial ao final da rota para fechar o ciclo
  rota.push(pontos[0])

  return {
    rota: rota,
    distanciaTotal: calcularDistanciaTotal(rota)
  }
}

function calcularDistanciaTotal(rota) {
  let distanciaTotal = 0
  for (let i = 0; i < rota.length - 1; i++) {
    distanciaTotal += calcularDistancia(rota[i], rota[i + 1])
  }
  return distanciaTotal
}
