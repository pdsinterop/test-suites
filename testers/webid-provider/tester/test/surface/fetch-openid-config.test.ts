import fetch from 'node-fetch'

test('/.well-known/openid-configuration is valid JSON', async () => {
  const result = await fetch('http://server:8080/.well-known/openid-configuration', {
    method: 'GET'
  })
  const obj = result.json()
  expect(obj).toEqual(' ')
})
