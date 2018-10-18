import { BasicAuthRequest } from '@xrc-inc/buy-sdk/ecnova/api/account/v1/account_proto/account_pb'
import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { Formik, FormikActions, FormikProps } from 'formik'
import { inject } from 'mobx-react'
import * as React from 'react'
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import { Button } from '../../../components/button'
import { BytesInput } from '../../../components/bytes-input'
import { Input } from '../../../components/input'
import { UIState } from '../../../store'

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
}).strict(true)

interface IBasicAuthorizeProps {
  ui?: UIState
  onAuthorize(values: BasicAuthRequest.AsObject): Promise<any>
}

@inject('ui')
export class BasicAuthorize extends React.Component<IBasicAuthorizeProps> {
  public componentDidMount() {
    this.props.ui!.setNavigationBarTitle('登录')
  }

  public render() {
    const { onAuthorize } = this.props
    const initialValues: BasicAuthRequest.AsObject = {
      username: '',
      email: '',
      phoneNumber: '',
      password: '',
      scopesList: [],
    }
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        isInitialValid
        render={(formikProps: FormikProps<BasicAuthRequest.AsObject>) => {
          return (
            <form onSubmit={formikProps.handleSubmit} className="login-form">
              <Input
                className="login-input"
                type="tel"
                name="username"
                value={formikProps.values.username}
                showClear={!!formikProps.values.username}
                onChange={formikProps.handleChange}
                placeholder="请输入手机号"
              />
              <BytesInput
                className="login-input"
                name="password"
                type="password"
                value={formikProps.values.password as any}
                onBytesChange={(value) => {
                  formikProps.setFieldValue('password', value)
                }}
                placeholder="输入密码"
              />
              <div className="login-tool-bar flex justify-between">
                <Link to="/auth/forget-password" className="text-grey">忘记密码？</Link>
                <Link to="/auth/signup">注册</Link>
              </div>
              <Button
                text="登录"
                type="submit"
                className="primary-button"
                disabled={formikProps.isSubmitting || !formikProps.isValid}
              />
            </form>
          )
        }}
        onSubmit={async (values: BasicAuthRequest.AsObject, formikActions: FormikActions<BasicAuthRequest.AsObject>) => {
          try {
            await onAuthorize(values)
          } catch (error) {
            formikActions.setStatus(error)
          } finally {
            formikActions.setSubmitting(false)
          }
        }}
      />
    )
  }
}
