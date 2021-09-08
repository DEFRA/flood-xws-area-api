const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const createServer = require('../server')

lab.experiment('API test', () => {
  let server

  // Create server before each test
  lab.before(async () => {
    server = await createServer()
  })

  // ignored as this is an integration test
  lab.test.skip('GET target areas in bounding box', async () => {
    const options = {
      method: 'GET',
      url: '/area?type=faa&bbox=-0.6491787738234618,54.46724864194341,-0.5897302021374998,54.494081333633694'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })
})
