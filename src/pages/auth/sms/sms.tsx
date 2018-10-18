import classnames from 'classnames'
import { Formik, FormikActions, FormikProps } from 'formik'
import * as React from 'react'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import { Button } from '../../../components/button'
import { Input } from '../../../components/input'

import { VerificationCodeInput } from './verification-code-input'

interface IAuthorizeProps {
  /** 是否显示“统一《服务协议》，默认为 true */
  showServiceAgreementLink?: boolean
  /** 手机号输入框的 Placehoder，默认为“请输入手机号” */
  phoneNumberPlaceholder?: string
  onSendCode(phoneNumber: string): Promise<any>
  onAuthorize(phoneNumber: string, code: string): void
}

const schema = yup.object({
  phoneNumber: yup.string().required(),
  code: yup.string().required(),
}).strict(true)

interface IFormValues { phoneNumber: string, code: string }

/**
 * SMSAuthorize 封装了使用 SMSAuth 服务登录诺闻系统的业务
 */
export class SMSAuthorize extends React.Component<IAuthorizeProps> {
  public render() {
    const {
      onSendCode,
      onAuthorize,
      showServiceAgreementLink = true,
      phoneNumberPlaceholder = '请输入手机号',
    } = this.props
    return (
      <Formik
        initialValues={{ phoneNumber: '', code: '' }}
        validationSchema={schema}
        isInitialValid={false}
        render={(formikProps: FormikProps<IFormValues>) => {
          const { code, phoneNumber } = formikProps.values
          return (
            <form onSubmit={formikProps.handleSubmit} className="login-form">
              <Input
                className="login-input"
                type="phone"
                name="phoneNumber"
                onChange={formikProps.handleChange}
                placeholder={phoneNumberPlaceholder}
              />
              <VerificationCodeInput
                valid={!!formikProps.values.phoneNumber}
                onChange={code => formikProps.setFieldValue('code', code)}
                onSendCode={() => onSendCode(`+86${formikProps.values.phoneNumber}`)}
              />
              <Button
                type="submit"
                text="下一步"
                className={classnames('primary-button', { disabled: !code || !phoneNumber })}
              />
              {showServiceAgreementLink &&
                <p className="service-agreement-link">用户注册代表同意<Link to="/help">《服务协议》</Link></p>
              }
            </form>
          )
        }}
        onSubmit={async (values: IFormValues, formikActions: FormikActions<IFormValues>) => {
          formikActions.setStatus(null)
          try {
            await onAuthorize(values.phoneNumber!, values.code)
          } catch (error) {
            console.warn('SMS authenticate failed: ', error)
            formikActions.setStatus(error)
          } finally {
            formikActions.setSubmitting(false)
          }
        }}
      />
    )
  }
}
