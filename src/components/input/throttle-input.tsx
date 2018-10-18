import React from 'react'

import { throttleHOC } from '../common/throttle'

import { Input, IInputProps } from './input'

export const ThrottleInput = throttleHOC<IInputProps, React.ChangeEvent<HTMLInputElement>>(Input)
