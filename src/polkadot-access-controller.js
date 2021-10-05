const { verifyIdentity } = require('./polkadot-identity-provider')
const { base58btc } = require("multiformats/bases/base58")

class PolkadotAccessController {
  constructor (orbitdb, idProvider, options) {
    this._orbitdb = orbitdb
    this._options = options || {}
    this.idProvider = idProvider
  }

  static get type () { return 'Polkadot' }

  get type () {
    return this.constructor.type
  }

  async canAppend (entry, identityProvider) {
    const orbitIdentity = this._orbitdb.identity
    const entryIdentity = entry.identity
    const verified = await verifyIdentity(entryIdentity)

    if (!verified) return false
    if (orbitIdentity.id !== entryIdentity.id) return false
    if (this._options.write.indexOf(orbitIdentity.id) === -1) return false
    if (!(await identityProvider._keystore.hasKey(entryIdentity.id))) return false

    return true
  }

  static async create (orbitdb, options) {
    return new PolkadotAccessController(orbitdb, {}, options)
  }

  async load (address) {
    const manifest = await this._orbitdb._ipfs.dag.get(address)
    return manifest.value
  }

  async save () {
    const cid = await this._orbitdb._ipfs.dag.put(this._options)
    return { address: cid.toString(base58btc) }
  }
}

module.exports = PolkadotAccessController
