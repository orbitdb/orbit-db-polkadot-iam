const assert = require('assert')
const PolkadotIdentities = require('../src/polkadot-identities')
const Keystore = require('orbit-db-keystore')
const { createIdentity } = require('./utils')

let identities, identity, keystore

describe('Identity Provider', function () {
  this.timeout(10000)

  before(() => {
    identities = new PolkadotIdentities()
    keystore = new Keystore()
  })

  beforeEach(async () => {
    await keystore.open()
  })

  it('can be added to Identities as a valid identity provider', () => {
    assert(identities.Identities.isSupported(identities.PolkadotIdentityProvider.type))
  })

  it('creates a valid identity object', async () => {
    identity = await createIdentity(identities, keystore)
    assert(await identities.PolkadotIdentityProvider.verifyIdentity(identity))
  })

  it('fails verification given an improper identity object', async () => {
    identity = await createIdentity(identities, keystore)
    identity._id = '5GRdmMkKeKaV94qU3JjDr2ZwRAgn3xwzd2FEJYKjjSFipiAf'
    try {
      await identities.PolkadotIdentityProvider.verifyIdentity(identity)
    } catch {
      assert(true)
    }
  })

  afterEach(async () => {
    await keystore.close()
  })

  after(async () => {
    await identity.provider._keystore.close()
  })
})
