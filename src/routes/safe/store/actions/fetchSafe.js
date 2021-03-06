// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List, Map } from 'immutable'
import { type GlobalState } from '~/store/index'
import { makeOwner } from '~/routes/safe/store/model/owner'
import { type SafeProps, makeSafe } from '~/routes/safe/store/model/safe'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { getOwners, getSafeName } from '~/utils/localStorage'
import { getGnosisSafeContract } from '~/logic/contracts/safeContracts'
import { getWeb3 } from '~/logic/wallets/getWeb3'

const buildOwnersFrom = (safeOwners: string[], storedOwners: Map<string, string>) => (
  safeOwners.map((ownerAddress: string) => {
    const ownerName = storedOwners.get(ownerAddress.toLowerCase()) || 'UNKNOWN'
    return makeOwner({ name: ownerName, address: ownerAddress })
  })
)

export const buildSafe = async (safeAddress: string, safeName: string) => {
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = GnosisSafe.at(safeAddress)

  const threshold = Number(await gnosisSafe.getThreshold())
  const owners = List(buildOwnersFrom(await gnosisSafe.getOwners(), getOwners(safeAddress)))

  const safe: SafeProps = {
    address: safeAddress,
    name: safeName,
    threshold,
    owners,
  }

  return makeSafe(safe)
}

export default (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const safeName = getSafeName(safeAddress) || 'LOADED SAFE'
    const safeRecord = await buildSafe(safeAddress, safeName)

    return dispatch(updateSafe(safeRecord))
  } catch (err) {
    // eslint-disable-next-line
    console.log("Error while updating safe information")

    return Promise.resolve()
  }
}
