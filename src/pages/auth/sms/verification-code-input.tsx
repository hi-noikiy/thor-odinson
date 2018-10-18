import classnames from 'classnames'
import * as React from 'react'

import { Input } from '../../../components/input'

import { Timer } from './timer'

interface IProps {
  valid?: boolean
  onChange(code: string): void
  onSendCode(): void
}
interface IState {
  sending: boolean
}

export class VerificationCodeInput extends React.Component<IProps, IState> {
  public state: IState = {
    sending: false,
  }

  public render() {
    const { valid = true, onChange } = this.props
    const { sending } = this.state
    return (
      <Input
        type="phone"
        className="login-input"
        name="verificationCode"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChange(event.currentTarget.value)
        }}
        placeholder="请输入验证码"
        rightElement={
          <Timer total={60}>
            {({ finish, remaining, startCountingDown }) => {
              return (
                <button
                  type="button"
                  className={classnames('send-code-button', { remaining: remaining > 0 })}
                  disabled={sending || !valid || remaining > 0}
                  onClick={async () => {
                    this.setState({ sending: true })
                    try {
                      await this.props.onSendCode()
                      startCountingDown()
                    } catch (error) {
                      console.warn('Failed to send verification code: ', error)
                      return
                    } finally {
                      this.setState({ sending: false })
                    }
                  }}
                >
                  {sending ? '正在发送' : finish ? '发送验证码' : `${remaining}s`}
                </button>
              )
            }}
          </Timer>
        }
      />
    )
  }
}
