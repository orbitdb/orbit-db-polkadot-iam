const AccessControllers = require('orbit-db-access-controllers')
const PolkadotAccessController = require('./polkadot-access-controller')
const PolkadotIdentityProvider = require('./polkadot-identity-provider')
const Identities = require('orbit-db-identity-provider')
const { Keyring } = require('@polkadot/api')

class PolkadotIAM {
  constructor () {
    AccessControllers.addAccessController({ AccessController: PolkadotAccessController })
    Identities.addIdentityProvider(PolkadotIdentityProvider)

    return {
      PolkadotAccessController,
      PolkadotIdentityProvider,
      AccessControllers,
      Identities
    }
  }

  static async createIdentity (phrase, iam, keystore) {
    const keyring = new Keyring({ type: 'sr25519' })
    const polkaKeys = keyring.addFromUri(phrase)

    const id = polkaKeys.address
    const key = await keystore.getKey(id) || await keystore.createKey(id)

    const idSignature = await keystore.sign(key, id)
    const polkaSignature = polkaKeys.sign(idSignature)

    const identity = await iam.Identities.createIdentity({
      type: 'Polkadot', id, keystore, polkaSignature, polkaKeys
    })

    return identity
  }
}

module.exports = PolkadotIAM
