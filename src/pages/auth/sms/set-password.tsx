import { Formik, FormikActions, FormikProps } from 'formik'
import * as React from 'react'

import { Button } from '../../../components/button'
import { BytesInput } from '../../../components/bytes-input'
import { decodeBase64 } from '../../../components/bytes-input/util'

function format(s: string): string {
  return String.fromCharCode.apply(null, decodeBase64(s))
}
interface IFormValues {
  password: string
}
interface IProps {
  onSubmit(password: string): void
}

export class SetPassword extends React.Component<IProps> {
  public render() {
    const { onSubmit } = this.props
    return (
      <Formik
        initialValues={{ password: '' }}
        validate={(values: IFormValues) => {
          const errors: any = {}
          if (values.password) {
            const pwd = format(values.password)
            if(!/^.{8,}$/.test(pwd)) {
              errors.password = '至少 8 位数字、字母或符号'
            }
          }
          return errors
        }}
        isInitialValid={false}
        render={(formikProps: FormikProps<IFormValues>) => {
          const { password } = formikProps.values
          return (
            <form onSubmit={formikProps.handleSubmit} className="login-form">
              <BytesInput
                type="password"
                name="password"
                value={password}
                onBytesChange={b => {
                  formikProps.setFieldValue('password', b)
                }}
                placeholder="密码"
              />
              <p className="helper-text">
                至少 8 位数字、字母或符号
              </p>
              <Button
                type="submit"
                text="下一步"
                disabled={formikProps.isSubmitting || !formikProps.isValid}
              />
            </form>
          )
        }}
        onSubmit={async (values: IFormValues, formikActions: FormikActions<IFormValues>) => {
          formikActions.setStatus(null)
          try {
            await onSubmit(values.password!)
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
