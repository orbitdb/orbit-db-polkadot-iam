const { signatureVerify } = require('@polkadot/util-crypto')

class PolkadotIdentityProvider {
  constructor (options) {
    this.id = options.id
    this.polkaKeys = options.polkaKeys
    this.idSignature = options.idSignature
  }

  getId () { return this.id }

  async signIdentity (_, options) {
    return options.polkaSignature
  }

  static get type () { return 'Polkadot' }

  static async verifyIdentity (identity) {
    const { id, signatures } = identity
    const { isValid } = signatureVerify(signatures.id, signatures.publicKey, id)
    return isValid
  }
}

module.exports = PolkadotIdentityProvider
