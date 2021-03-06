const assert = require('assert')
const OrbitDB = require('orbit-db')
const IPFS = require('ipfs')
const rmrf = require('rimraf')

const {
  AccessControllers,
  createIdentity,
  PolkadotAccessController
} = require('../src/orbit-db-polkadot-iam')

const IPFSConfig = { Addresses: { Swarm: [] }, Bootstrap: [] }
const phrase = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought'

describe('Access Controller', function () {
  this.timeout(10000)

  let orbitdb, ipfs, identity

  before(async () => {
    rmrf('./orbitdb', () => {})
    rmrf('./keystore', () => {})

    ipfs = await IPFS.create({ preload: { enabled: false }, config: IPFSConfig })

    identity = await createIdentity(phrase)

    orbitdb = await OrbitDB.createInstance(ipfs, {
      AccessControllers: AccessControllers,
      identity: identity
    })
  })

  after(async () => {
    await identity.provider._keystore.close()
    await identity.provider._signingKeystore.close()
    await orbitdb.disconnect()
    await ipfs.stop()
  })

  it('reports the correct type', async () => {
    assert.strictEqual(PolkadotAccessController.type, 'Polkadot')
  })

  it('allows correct keys to write to the db', async () => {
    const db = await orbitdb.kvstore('root', {
      accessController: {
        type: 'Polkadot',
        write: [identity.id]
      },
      replicate: false
    })

    await db.set('foo', 'bar')
    assert.deepStrictEqual(db.index, { foo: 'bar' })
    await db.close()
  })

  it('disallows incorrect keys to write to the db', async () => {
    const db = await orbitdb.kvstore('root', {
      accessController: {
        type: 'Polkadot',
        write: []
      },
      replicate: false
    })

    try {
      await db.set('foo', 'bar')
    } catch {
      await db.close()
      assert(true)
    }
  })
})
