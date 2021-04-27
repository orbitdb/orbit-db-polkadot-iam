const AccessControllers = require('orbit-db-access-controllers');
const PolkadotIdentities = require('./polkadot-identities');

class PolkadotAccessController {
  constructor (orbitdb, identities, options) {
    this._orbitdb = orbitdb
    this._options = options || {}
    this.idProvider = identities.PolkadotIdentityProvider
  }

  static get type () { return 'Polkadot' }

  get type() {
    return this.constructor.type
  }

  async canAppend(entry, identityProvider) {
    const orbitIdentity = this._orbitdb.identity
    const entryIdentity = entry.identity
    const verified = await this.idProvider.verifyIdentity(entryIdentity)

    if (!verified) return false
    if (orbitIdentity.id !== entryIdentity.id) return false
    if (this._options.write.indexOf(orbitIdentity.id) === -1) return false
    if (!(await identityProvider._keystore.hasKey(entryIdentity.id))) return false

    return true
  }

  static async create (orbitdb, options) {
    const identities = new PolkadotIdentities()
    return new PolkadotAccessController(orbitdb, identities, options)
  }

  async load (address) {
    const manifest = await this._orbitdb._ipfs.dag.get(address)
    return manifest.value
  }

  async save () {
    const cid = await this._orbitdb._ipfs.dag.put(this._options)
    return { address: cid.toBaseEncodedString() }
  }
}

function PolkadotAccess() {
  AccessControllers.addAccessController({ AccessController: PolkadotAccessController })

  return {
    PolkadotAccessController,
    AccessControllers
  }
}

module.exports = PolkadotAccess
