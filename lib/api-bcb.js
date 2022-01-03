const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$skip=0&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

const getCotacaoURL = url => axios.get(url)
const extractCotacao = res => res.data.value[0].cotacaoCompra
const getToday = () =>{
  const today = new Date()
  return `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`
}
const getCotacao = ({getToday,getUrl,getCotacaoURL,extractCotacao}) => async () => {
  try {
    const data= getToday()
    const url = getUrl(data)
    const res = await getCotacaoURL(url)
    const cotacao = extractCotacao(res)
    return cotacao
  } catch (err) {
    return ''
  }
}

module.exports = {
  getCotacaoURL,
  getCotacao: getCotacao({getToday,getUrl,getCotacaoURL,extractCotacao}),
  extractCotacao,
  getToday,
  getUrl,
  pure:{
    getCotacao
  }
}
