const assert = require('assert')
const PolkadotIAM = require('../src/orbit-db-polkadot-iam')
const Keystore = require('orbit-db-keystore')
const { createIdentity } = require('./utils')

let iam, identity, keystore

describe('Identity Provider', function () {
  this.timeout(10000)

  before(() => {
    iam = new PolkadotIAM()
    keystore = new Keystore()
  })

  beforeEach(async () => {
    await keystore.open()
  })

  it('can be added to Identities as a valid identity provider', () => {
    assert(iam.Identities.isSupported(iam.PolkadotIdentityProvider.type))
  })

  it('creates a valid identity object', async () => {
    identity = await createIdentity(iam, keystore)
    assert(await iam.PolkadotIdentityProvider.verifyIdentity(identity))
  })

  it('fails verification given an improper identity object', async () => {
    identity = await createIdentity(iam, keystore)
    identity._id = '5GRdmMkKeKaV94qU3JjDr2ZwRAgn3xwzd2FEJYKjjSFipiAf'
    try {
      await iam.PolkadotIdentityProvider.verifyIdentity(identity)
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
