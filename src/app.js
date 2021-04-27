// Required imports
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const IPFS = require('ipfs')
const OrbitDB = require('orbit-db');
const Keystore = require('orbit-db-keystore');
const PolkadotIdentities = require('../src/polkadot-identities');
const PolkadotAccess = require('../src/polkadot-access');

async function main () {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io')
  const api = await ApiPromise.create({ provider: wsProvider })

  const polkadotIdentities = new PolkadotIdentities()

  const keystore = new Keystore()
  await keystore.open()

  const keyring = new Keyring({ type: 'sr25519' })

  const PHRASE = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought'
  const polkaKeys = keyring.addFromUri(PHRASE)

  const id = polkaKeys.address
  const key = await keystore.getKey(id) || await keystore.createKey(id)
  const idSignature = await keystore.sign(key, id)
  const polkaSignature = polkaKeys.sign(idSignature)

  const identity = await polkadotIdentities.Identities.createIdentity({
    type: "Polkadot", id, keystore, polkaSignature, polkaKeys
  })

  const access = new PolkadotAccess()

  const ipfs = await IPFS.create()
  const orbitdb = await OrbitDB.createInstance(ipfs, {
    AccessControllers: access.AccessControllers,
    identity: identity
  })

  const db = await orbitdb.kvstore('root', {
    accessController: {
      type: 'Polkadot',
      write: [identity.id]
    }
  })

  await db.put('foo', 'bar')
  console.log(db.index)
}

main().catch(console.error).finally((err) => { if(err) console.error(err) }); // process.exit());
