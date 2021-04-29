# OrbitDB / Polkadot IAM _(orbit-db-polkadot-iam)_

> Identity Provider and Access Controller for Polkadot / Substrate based accounts

## Install

This is a [node.js](https://nodejs.org) project.

```bash
# deps
npm install ipfs orbit-db @polkadot/api

# install this package
npm install orbit-db-polkadot-iam
```

See the [tests](https://github.com/orbitdb/orbit-db-polkadot-iam/tree/main/test)
for examples or the following usage section.

## Usage

```JavaScript
const { Keyring } = require('@polkadot/api')
const Keystore = require('orbit-db-keystore')
const { AccessControllers, createIdentity } = require('orbit-db-polkadot-iam')
const OrbitDB = require('orbit-db')
const IPFS = require('ipfs')

// Identity creation based on the passphrase from the Polkadot documentation.
const iam = new PolkadotIAM()
const phrase = 'entire material egg meadow latin bargain dutch coral blood melt acoustic thought'
const identity = await PolkadotIAM.createIdentity(phrase)

// Identity verification using the OrbitDB internals
// See: https://github.com/orbitdb/orbit-db-identity-provider
assert(await iam.PolkadotIdentityProvider.verifyIdentity(identity))

// Usage with IPFS and OrbitDB
const ipfs = await IPFS.create()

orbitdb = await OrbitDB.createInstance(ipfs, {
  AccessControllers: iam.AccessControllers,
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
```

## Contributing

Issues and PRs welcome.

## License

MIT © 2021 OrbitDB Community
