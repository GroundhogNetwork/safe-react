// @flow
import { makeSafe, type Safe } from '~/routes/safe/store/model/safe'
import { buildOwnersFrom } from '~/routes/safe/store/actions/addSafe'

class SafeBuilder {
  safe: Safe

  constructor() {
    this.safe = makeSafe()
  }

  withAddress(address: string) {
    this.safe = this.safe.set('address', address)
    return this
  }

  withName(name: string) {
    this.safe = this.safe.set('name', name)
    return this
  }

  withConfirmations(confirmations: number) {
    this.safe = this.safe.set('threshold', confirmations)
    return this
  }

  withOwner(names: string[], adresses: string[]) {
    const owners = buildOwnersFrom(names, adresses)
    this.safe = this.safe.set('owners', owners)
    return this
  }

  get() {
    return this.safe
  }
}

const aSafe = () => new SafeBuilder()

export class SafeFactory {
  static oneOwnerSafe = (ownerAddress: string = '0x03db1a8b26d08df23337e9276a36b474510f0023') => aSafe()
    .withAddress('0x03db1a8b26d08df23337e9276a36b474510f0025')
    .withName('Adol ICO Safe')
    .withConfirmations(1)
    .withOwner(['Adol Metamask'], [ownerAddress])
    .get()

  static twoOwnersSafe = (firstOwner: string = '0x03db1a8b26d08df23337e9276a36b474510f0023', secondOwner: string = '0x03db1a8b26d08df23337e9276a36b474510f0024') => aSafe()
    .withAddress('0x03db1a8b26d08df23337e9276a36b474510f0026')
    .withName('Adol & Tobias Safe')
    .withConfirmations(2)
    .withOwner(
      ['Adol Metamask', 'Tobias Metamask'],
      [firstOwner, secondOwner],
    )
    .get()
}

export default aSafe
