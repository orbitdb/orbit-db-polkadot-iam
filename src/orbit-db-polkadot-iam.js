const AccessControllers = require('orbit-db-access-controllers')
const PolkadotAccessController = require('./polkadot-access-controller')
const PolkadotIdentityProvider = require('./polkadot-identity-provider')
const Identities = require('orbit-db-identity-provider')
const Keystore = require('orbit-db-keystore')
const { Keyring } = require('@polkadot/keyring')
const { cryptoWaitReady } = require('@polkadot/util-crypto')

AccessControllers.addAccessController({ AccessController: PolkadotAccessController })
Identities.addIdentityProvider(PolkadotIdentityProvider)

async function createIdentity (phrase) {
  await cryptoWaitReady()
  const keyring = new Keyring({ type: 'sr25519' })
  const polkaKeys = keyring.addFromUri(phrase)

  const id = polkaKeys.address
  const keystore = new Keystore()
  const key = await keystore.getKey(id) || await keystore.createKey(id)

  const idSignature = await keystore.sign(key, id)
  const polkaSignature = polkaKeys.sign(idSignature)

  const identity = await Identities.createIdentity({
    type: 'Polkadot', id, keystore, polkaSignature, polkaKeys
  })

  return identity
}

module.exports = {
  PolkadotAccessController,
  PolkadotIdentityProvider,
  AccessControllers,
  Identities,
  createIdentity
}
