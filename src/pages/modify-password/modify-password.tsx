import { Formik, FormikActions, FormikProps } from 'formik'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Portal } from 'react-portal'
import { RouteComponentProps } from 'react-router'

import { Button } from '../../components/button'
import { BytesContent } from '../../components/bytes-content'
import { decodeBase64 } from '../../components/bytes-input/util'
import { FloatingTextField } from '../../components/floating-text-field'
import { AccountStore, UIState } from '../../store'

function format(s: string): string {
  return String.fromCharCode.apply(null, decodeBase64(s))
}
interface IFormValues {
  password: string
}

interface IProps extends RouteComponentProps<{}> {
  ui?: UIState
  accountStore?: AccountStore
}

@inject('ui', 'accountStore')
@observer
export class ModifyPassword extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
    props.ui!.setNavigationBarTitle('修改密码')
  }

  public render() {
    const { ui, accountStore, history } = this.props
    return (
      <div className="modify-password-page">
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
              <form onSubmit={formikProps.handleSubmit}>
                <BytesContent bytesValue={password} onChange={b => formikProps.setFieldValue('password', b)}>
                  {({ value, setValue }) => (
                    <FloatingTextField
                      label="新密码"
                      name="password"
                      type="password"
                      value={value}
                      onChange={evt => setValue(evt.currentTarget.value)}
                    />)
                  }
                </BytesContent>
                <p className="helper-text">
                  至少 8 位数字、字母或符号
                </p>
                <Portal>
                  <div className="bottom-action-wrapper">
                    <Button
                      type="submit"
                      text="确认"
                      onClick={formikProps.submitForm}
                      disabled={formikProps.isSubmitting || !formikProps.isValid}
                    />
                  </div>
                </Portal>
              </form>
            )
          }}
          onSubmit={async (values: IFormValues, formikActions: FormikActions<IFormValues>) => {
            formikActions.setStatus(null)
            ui!.showModal()
            try {
              const jwt = await accountStore!.allocateJWT()
              await accountStore!.setPassword(values.password, jwt)
            } catch (error) {
              console.warn('reset password: ', error)
              formikActions.setStatus(error)
              return
            } finally {
              ui!.hideModal()
              formikActions.setSubmitting(false)
            }
            ui!.toast('密码已修改')
            history.goBack()
          }}
        />
      </div>
    )
  }
}
