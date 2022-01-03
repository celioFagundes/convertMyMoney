const apiBCB = require('./api-bcb')
const axios = require('axios')

jest.mock('axios')

test('getCotacaoURL', () => {
  const res = {
    data: {
      value: [{ cotacaoVenda: 5.6432 }],
    },
  }
  axios.get.mockResolvedValue(res)
  apiBCB.getCotacaoURL('url').then(response => {
    expect(response).toEqual(res)
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
})

test('extractCotacao', () => {
  const cotacao = apiBCB.extractCotacao({
    data: {
      value: [{ cotacaoCompra: 5.6432 }],
    },
  })
  expect(cotacao).toBe(5.6432)
})

describe('getToday', () => {

    const RealDate = Date
    const mockDate = (date) =>{
        global.Date = class extends RealDate{
            constructor(){
                return new RealDate(date)
            }
        }
    }
    afterEach(() =>{
        global.Date = RealDate
    })

    test('getToday',() =>{
        mockDate('2019-01-01T12:00:00z')
        const today = apiBCB.getToday()
        expect(today).toBe('1-1-2019')
    })
})

test('getUrl', () =>{
    const url = apiBCB.getUrl('1-1-2019')
    expect(url).toBe('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%271-1-2019%27&$top=100&$skip=0&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao')
})

test('getCotacao', () =>{

    const res = {
        data: {
          value: [{ cotacaoVenda: 5.6432 }],
        },
      }
    const getToday = jest.fn()
    getToday.mockReturnValue('01-01-2019')
    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')
    const getCotacaoURL = jest.fn()
    getCotacaoURL.mockResolvedValue(res)
    const extractCotacao = jest.fn()
    extractCotacao.mockReturnValue(5.6432)

    apiBCB.pure
    .getCotacao({getToday,getUrl,getCotacaoURL,extractCotacao})()
    .then(res => {
        expect(res).toBe(5.6432)
    })
})