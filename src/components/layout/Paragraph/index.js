// @flow
import * as React from 'react'
import classNames from 'classnames/bind'
import styles from './index.scss'

const cx = classNames.bind(styles)

type Props = {
  align?: 'right' | 'center' | 'left',
  noMargin?: boolean,
  weight?: 'light' | 'regular' | 'bolder' | 'bold',
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  color?: 'soft' | 'medium' | 'dark' | 'white' | 'fancy' | 'primary' | 'secondary' | 'warning' | 'disabled',
  transform?: 'capitalize' | 'lowercase' | 'uppercase',
  children: React$Node,
  dot?: boolean,
  className?: string,
}

class Paragraph extends React.PureComponent<Props> {
  render() {
    const {
      weight, children, color, align, size, transform, noMargin, className, dot, ...props
    } = this.props

    return (
      <p
        className={cx(styles.paragraph, className, weight, { noMargin }, { dot }, size, color, transform, align)}
        {...props}
      >
        { children }
      </p>
    )
  }
}

export default Paragraph
