// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Hairline from '~/components/layout/Hairline'
import Block from '~/components/layout/Block'
import Identicon from '~/components/Identicon'
import { withStyles } from '@material-ui/core/styles'
import Heading from '~/components/layout/Heading'
import Row from '~/components/layout/Row'
import Paragraph from '~/components/layout/Paragraph'
import NoSafe from '~/components/NoSafe'
import { type SelectorProps } from '~/routes/safe/container/selector'
import { openAddressInEtherScan } from '~/logic/wallets/getWeb3'
import { sm, xs, secondary, smallFontSize } from '~/theme/variables'
import Balances from './Balances'

type Props = SelectorProps & {
  classes: Object,
  granted: boolean,
}

type State = {
  value: number,
}

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const styles = () => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: sm,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  user: {
    justifyContent: 'left',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  readonly: {
    fontSize: smallFontSize,
    letterSpacing: '0.5px',
    color: '#ffffff',
    backgroundColor: '#a2a8ba',
    fontFamily: 'Roboto Mono, monospace',
    textTransform: 'uppercase',
    padding: `0 ${sm}`,
    marginLeft: sm,
    borderRadius: xs,
    lineHeight: '28px',
  },
})

class Layout extends React.Component<Props, State> {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const {
      safe, provider, network, classes, granted, tokens, activeTokens,
    } = this.props
    const { value } = this.state

    if (!safe) {
      return <NoSafe provider={provider} text="Safe not found" />
    }
    // <GnoSafe safe={safe} tokens={activeTokens} userAddress={userAddress} />
    const address = safe.get('address')

    return (
      <React.Fragment>
        <Block className={classes.container} margin="xl">
          <Identicon address={address} diameter={50} />
          <Block className={classes.name}>
            <Row>
              <Heading tag="h2" color="secondary">{safe.get('name')}</Heading>
              { !granted &&
                <Block className={classes.readonly} >
                  Read Only
                </Block>
              }
            </Row>
            <Block align="center" className={classes.user}>
              <Paragraph size="md" color="disabled" noMargin>{address}</Paragraph>
              <OpenInNew
                className={classes.open}
                style={openIconStyle}
                onClick={openAddressInEtherScan(address, network)}
              />
            </Block>
          </Block>
        </Block>
        <Row>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="secondary"
          >
            <Tab label="Balances" />
            <Tab label="Transactions" />
            <Tab label="Settings" />
          </Tabs>
        </Row>
        <Hairline color="#c8ced4" />
        {value === 0 &&
          <Balances
            tokens={tokens}
            activeTokens={activeTokens}
            granted={granted}
            safeAddress={address}
          />}
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Layout)
