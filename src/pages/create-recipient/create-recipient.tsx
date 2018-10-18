import { MyRecipient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { PostalAddress } from '@xrc-inc/buy-sdk/google/type/postal_address_pb'
import { Formik, FormikActions, FormikProps } from 'formik'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Portal } from 'react-portal'
import { RouteComponentProps } from 'react-router'
import * as yup from 'yup'

import { Button } from '../../components/button'
import { Checkbox } from '../../components/checkbox'
import { FloatingTextField } from '../../components/floating-text-field'
import { IconChevronRight } from '../../components/icons'
import { ProfileStore, RecipientsStore, RecipientStore, StorefrontStore, UIState } from '../../store'

const schema = yup
  .object({
    fullName: yup.string().required(),
    phoneNumber: yup
      .string()
      .matches(/^1\d{10}$/)
      .required(),
    postalAddress: yup
      .object({
        addressLinesList: yup
          .array(yup.string().required())
          .min(2)
          .required(),
      })
      .required(),
  })
  .strict(true)

interface IRecipientPage extends RouteComponentProps<{}> {
  ui?: UIState
  recipientStore?: RecipientStore
  storefrontStore?: StorefrontStore
  recipientsStore?: RecipientsStore
  profileStore?: ProfileStore
}
interface ICreateRecipientState {
  isDefault: boolean
  type: string
}
@inject(
  'storefrontStore',
  'recipientsStore',
  'recipientStore',
  'ui',
  'profileStore',
)
@observer
export class CreateRecipient extends React.Component<IRecipientPage, ICreateRecipientState> {
  public default = false
  constructor(props: IRecipientPage) {
    super(props)
    props.ui!.setNavigationBarTitle(`${this.props.recipientStore!.recipient ? '编辑' : '添加'}收货地址`)
    this.state = {
      isDefault: false,
      type: props.location.search.includes('update') ? 'update' : 'create',
    }
  }

  public async componentDidMount() {
    if (!this.props.profileStore!.loaded) {
      await this.props.profileStore!.load()
    }
    const { isDefault, type } = this.state
    const { recipientStore } = this.props
    if (type === 'update' && !recipientStore!.recipient) {
      this.props.history.goBack()
    }
    if (type === 'update') {
      try {
        const recipientId = this.props.recipientStore!.recipient && this.props.recipientStore!.recipient!.toObject().recipientId
        const defaultRecientId =
          this.props.profileStore!.getDefaultRecipient() &&
          this.props.profileStore!.getDefaultRecipient()!.toObject().recipientId
        if (!isDefault && defaultRecientId === recipientId) {
          this.setState({ isDefault: true })
          this.default = true
        }
      } catch (error) {
        console.error(error)
        this.props.history.goBack()
      }
    }
  }

  public render() {
    const { isDefault, type } = this.state
    const { recipientStore } = this.props
    let initialValues = {
      storefront: this.props.storefrontStore!.name,
      fullName: '',
      phoneNumber: '',
      postalAddress: {
        regionCode: 'CN',
        languageCode: 'zh-CN',
        administrativeArea: '北京市',
        locality: '北京市',
        sublocality: '',
        addressLinesList: ['', ''],
      } as PostalAddress.AsObject,
    } as MyRecipient.AsObject
    if (recipientStore!.recipient && recipientStore!.recipient!.toObject().postalAddress) {
      try {
        initialValues = recipientStore!.recipient!.toObject()
      } catch (error) {
        console.error(error)
        this.props.history.goBack()
      }
    }
    return (
      <Formik
        initialValues={initialValues}
        isInitialValid={schema.isValidSync(initialValues as any)}
        validationSchema={schema}
        render={(formikProps: FormikProps<MyRecipient.AsObject>) => {
          return (
            <form onSubmit={formikProps.handleSubmit} className="recipient-form">
              <div className="create-recipient">
                <div className="floating-choose-flied" onClick={this.getLocality.bind(this, formikProps.values)}>
                  {formikProps.values.postalAddress &&
                    formikProps.values.postalAddress.sublocality ? (
                      <div className="area">
                        <label className="lable-small">地址</label>
                        <span className="area-size">
                          {formikProps.values.postalAddress!.administrativeArea}
                          {formikProps.values.postalAddress!.locality}
                          {formikProps.values.postalAddress!.sublocality}
                          {formikProps.values.postalAddress!.addressLinesList[0]}
                        </span>
                      </div>
                    ) : (
                      <label className="lable-big">选择收货地址</label>
                    )}
                  <span>
                    <IconChevronRight className="right-color" />
                  </span>
                </div>
                <FloatingTextField
                  label="门牌号"
                  isErr={formikProps.errors.postalAddress && !!formikProps.errors.postalAddress!.addressLinesList[1]}
                  value={
                    formikProps.values.postalAddress &&
                    formikProps.values.postalAddress!.addressLinesList[1]
                  }
                  name="postalAddress.addressLinesList.1"
                  onChange={formikProps.handleChange}
                />
                <FloatingTextField
                  label="姓名"
                  isErr={!!formikProps.errors.fullName}
                  name="fullName"
                  value={formikProps.values.fullName}
                  onChange={formikProps.handleChange}
                />
                <FloatingTextField
                  label="电话"
                  isErr={!!formikProps.errors.phoneNumber}
                  name="phoneNumber"
                  value={formikProps.values.phoneNumber}
                  onChange={formikProps.handleChange}
                />
                <div className={`is-default ${type === 'update' ? 'update' : ''}`}>
                  <Checkbox checked={isDefault} label="设为默认地址" onChange={this.changeDefault} />
                  {type === 'update' && <div className="small-button info-btn" onClick={this.delete}>删除地址</div>}
                </div>
                <Portal>
                  <div className="bottom-action-wrapper">
                    <div className="to-save-recipient">
                      <Button
                        text="保存"
                        type="submit"
                        disabled={formikProps.isSubmitting || !formikProps.isValid}
                        onClick={formikProps.submitForm}
                      />
                    </div>
                  </div>
                </Portal>
              </div>
            </form>
          )
        }}
        onSubmit={async (values: MyRecipient.AsObject, formikActions: FormikActions<MyRecipient.AsObject>) => {
          try {
            this.props.ui!.showModal({ description: '保存中...' })
            const { recipientStore, recipientsStore } = this.props
            if (type === 'update') {
              await recipientStore!.update(values, this.state.isDefault)
            } else {
              await recipientsStore!.create(values, this.state.isDefault)
            }
            recipientStore!.setRecipient()
            this.props.history.goBack()
          } catch (error) {
            formikActions.setStatus(error)
            formikActions.setSubmitting(false)
          } finally {
            this.props.ui!.hideModal()
          }
        }}
      />
    )
  }
  public getLocality = (myRecipient: MyRecipient.AsObject) => {
    const { recipientStore, history } = this.props
    recipientStore!.setRecipient(myRecipient)
    history.push('/search-recipient')
  }
  public delete = async () => {
    try {
      if (window.confirm('删除不可恢复，确认删除吗？')) {
        this.props.ui!.showModal({ description: '删除中...' })
        const { recipientStore, recipientsStore } = this.props
        await recipientStore!.delete()
        await recipientsStore!.load()
        if (this.default && recipientsStore!.recipients.length) {
          recipientStore!.setRecipient(recipientsStore!.recipients[0].toObject())
          await recipientStore!.setDefault()
        }
        this.props.history.goBack()
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.props.ui!.hideModal()
    }
  }
  public changeDefault = () => {
    if (!this.default) {
      const { isDefault } = this.state
      this.setState({ isDefault: !isDefault })
      return
    }
    this.props.ui!.toast('必须有一个默认收货地址')
  }
}
