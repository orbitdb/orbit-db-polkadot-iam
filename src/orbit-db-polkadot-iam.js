const AccessControllers = require('orbit-db-access-controllers')
const PolkadotAccessController = require('./polkadot-access-controller')
const PolkadotIdentityProvider = require('./polkadot-identity-provider')
const Identities = require('orbit-db-identity-provider')

function PolkadotIAM () {
  AccessControllers.addAccessController({ AccessController: PolkadotAccessController })
  Identities.addIdentityProvider(PolkadotIdentityProvider)

  return {
    PolkadotAccessController,
    PolkadotIdentityProvider,
    AccessControllers,
    Identities
  }
}

module.exports = PolkadotIAM
