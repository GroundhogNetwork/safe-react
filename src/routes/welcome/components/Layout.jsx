// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Heading from '~/components/layout/Heading'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import { OPEN_ADDRESS, LOAD_ADDRESS } from '~/routes/routes'
import { marginButtonImg } from '~/theme/variables'
import styles from './Layout.scss'

const safe = require('../assets/safe.svg')
const plus = require('../assets/new.svg')

type Props = {
  provider: string
}

type SafeProps = {
  provider: string,
  size?: 'small' | 'medium' | 'large',
}

const buttonStyle = {
  marginLeft: marginButtonImg,
}

export const CreateSafe = ({ size, provider }: SafeProps) => (
  <Button
    component={Link}
    to={OPEN_ADDRESS}
    variant="raised"
    size={size || 'medium'}
    color="primary"
    disabled={!provider}
    minWidth={240}
  >
    <Img src={plus} height={14} alt="Safe" />
    <div style={buttonStyle}>Create new Safe</div>
  </Button>
)

export const LoadSafe = ({ size, provider }: SafeProps) => (
  <Button
    component={Link}
    to={LOAD_ADDRESS}
    variant="outlined"
    size={size || 'medium'}
    color="secondary"
    disabled={!provider}
    minWidth={240}
  >
    <Img src={safe} height={14} alt="Safe" />
    <div style={buttonStyle}>Load existing Safe</div>
  </Button>
)


const Welcome = ({ provider }: Props) => (
  <Block className={styles.safe}>
    <Heading tag="h1" align="center" margin="lg">
      Welcome to the Gnosis <br />
      Safe Team Edition
    </Heading>
    <Heading tag="h4" align="center" margin="xl" color="white">
      The Gnosis Safe Team Edition is geared towards teams managing <br />
      shared crypto funds. It is an improvement of the existing Gnosis <br />
      MultiSig wallet with redesigned smart contracts, cheaper setup and <br />
      transaction costs as well as an enhanced user experience.
    </Heading>
    <Block className={styles.safeActions} margin="md">
      <CreateSafe size="large" provider={provider} />
    </Block>
    <Block className={styles.safeActions} margin="md">
      <LoadSafe size="large" provider={provider} />
    </Block>
  </Block>
)

export default Welcome
