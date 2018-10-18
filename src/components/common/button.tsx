import classNames from 'classnames'
import * as React from 'react'

interface IButtonProps {
  type: 'primary' | 'secondary' | 'default'
  value: string,
  className: string,
  color: string,
  disable: boolean,
  onClick: (e: React.SyntheticEvent) => void
}

export const Button = (props: Partial<IButtonProps>) => {
  const { type = 'default', value, className, disable = false, onClick = (e: React.SyntheticEvent) => {} } = props
  const stylesDefault = {
    background: '#D0D4DF',
    borderRadius: '1rem',
    color: 'white',
    boxShadow: '',
    fontSize: '16px',
  }
  const stylesPrimary = {
    ...stylesDefault,
    background: '#048DF5',
    boxShadow: '0 .2rem .4rem 0 rgba(0,0,0,0.15)',
  }
  const stylesSecondary = {
    ...stylesDefault,
    background: 'linear-gradient(31deg, #FFAF00 0%, #FF8C02 100%)',
    boxShadow: '0 .2rem .4rem 0 rgba(0,0,0,0.15)',
  }
  let styles = null
  if (type === 'default' || disable) {
    styles = stylesDefault
  } else if (type === 'primary') {
    styles = stylesPrimary
  } else {
    styles = stylesSecondary
  }
  const handleClick = (e: React.SyntheticEvent) => {
    if (disable) {
      return
    }
    onClick(e)
  }
  return <button className={classNames('default-btn', className)} style={styles} onClick={handleClick}>{value}</button>
}
