// The example from the README file

const assert = require('assert')
const OrbitDB = require('orbit-db')
const IPFS = require('ipfs')
const {
  AccessControllers,
  PolkadotIdentityProvider,
  createIdentity
} = require('../src/orbit-db-polkadot-iam')

;(async function () {
  // Identity creation based on the passphrase from the Polkadot documentation.
  const phrase = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought'
  const identity = await createIdentity(phrase)

  // Identity verification using the OrbitDB internals
  // See: https://github.com/orbitdb/orbit-db-identity-provider
  assert(await PolkadotIdentityProvider.verifyIdentity(identity))

  // Usage with IPFS and OrbitDB
  const ipfs = await IPFS.create()

  const orbitdb = await OrbitDB.createInstance(ipfs, {
    AccessControllers: AccessControllers,
    identity: identity
  })

  // Write access can currently be any polkadot ID aka address
  const db = await orbitdb.kvstore('root', {
    accessController: {
      type: 'Polkadot',
      write: [identity.id]
    }
  })

  // Only allowed accounts will be permitted to write to the db
  await db.set('foo', 'bar')

  console.log(db.index)
  process.exit()
})()
