export const calcularCoordenadas = (clientes, localizacaoFixa) => {
  try {
    //Distância em relação à localização fixa
    const distancias = clientes.map((coordenada) =>

      
      calcularDistancias(
        localizacaoFixa.latitude,
        localizacaoFixa.longitude,
        coordenada.latitude,
        coordenada.longitude
      )
    )

    const rotaComDistancia = {
      clientes,
      distancia: distancias[0]
    }

    return rotaComDistancia
  } catch (error) {
    console.error('Erro ao calcular rota otimizada', error)
    throw error
  }
}

export const calcularDistancias = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
  // Conversões de graus para radianos
  const angulo_Latitude1 = (Math.PI * latitude1) / 180
  const angulo_Latitude2 = (Math.PI * latitude2) / 180
  const diferencaAngular = longitude1 - longitude2

  const calculo_Rad = (Math.PI * diferencaAngular) / 180
  let ponto =
    Math.sin(angulo_Latitude1) * Math.sin(angulo_Latitude2) +
    Math.cos(angulo_Latitude1) *
      Math.cos(angulo_Latitude2) *
      Math.cos(calculo_Rad)
  ponto = Math.acos(ponto)
  ponto = (ponto * 180) / Math.PI
  ponto = ponto * 60 * 1.1515
  ponto = ponto * 1.609344

  const result = Number(ponto.toFixed(2))

  return result
}
