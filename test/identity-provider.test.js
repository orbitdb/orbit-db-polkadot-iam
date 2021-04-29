const assert = require('assert')
const {
  createIdentity,
  Identities,
  PolkadotIdentityProvider
} = require('../src/orbit-db-polkadot-iam')

let iam, identity

const phrase = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought'

describe('Identity Provider', function () {
  this.timeout(10000)

  it('can be added to Identities as a valid identity provider', () => {
    assert(Identities.isSupported(PolkadotIdentityProvider.type))
  })

  it('creates a valid identity object', async () => {
    const identity = await createIdentity(phrase)
    assert(await PolkadotIdentityProvider.verifyIdentity(identity))
    await identity.provider._keystore.close()
  })

  it('fails verification given an improper identity object', async () => {
    const phrase = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought'
    identity = await createIdentity(phrase)
    identity._id = '5GRdmMkKeKaV94qU3JjDr2ZwRAgn3xwzd2FEJYKjjSFipiAf'
    try {
      await iam.PolkadotIdentityProvider.verifyIdentity(identity)
    } catch {
      assert(true)
    }
    await identity.provider._keystore.close()
  })
})
