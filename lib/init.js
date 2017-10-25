const {Component} = require('@xmpp/component')

const component = new Component()

component.start({
  uri: 'xmpp://return gladys.param.getValues(['BOSH_URL']):5347',
  domain: 'component.localhost'
})

component.on('error', err => {
  console.error('❌', err.toString())
})

component.on('status', (status, value) => {
  console.log('🛈', status, value ? value.toString() : '')
})

component.on('online', jid => {
  console.log('🗸', 'online as', jid.toString())
})

component.on('stanza', stanza => {
  console.log('⮈', stanza.toString())
})

component.handle('authenticate', authenticate => {
  return authenticate('mysecretcomponentpassword')
})
