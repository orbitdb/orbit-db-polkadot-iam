const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api')

async function createIdentity(identities, keystore) {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io')
  const api = await ApiPromise.create({ provider: wsProvider })

  const keyring = new Keyring({ type: 'sr25519' })

  const PHRASE = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought'
  const polkaKeys = keyring.addFromUri(PHRASE)

  const id = polkaKeys.address
  const key = await keystore.getKey(id) || await keystore.createKey(id)

  const idSignature = await keystore.sign(key, id)
  const polkaSignature = polkaKeys.sign(idSignature)

  identity = await identities.Identities.createIdentity({
    type: "Polkadot", id, keystore, polkaSignature, polkaKeys
  })

  return identity
}

module.exports = {
  createIdentity
}
