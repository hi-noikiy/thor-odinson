import { AuthenticateRequest as OAuth2AuthenticateRequest, AuthorizeRequest as OAuth2AuthorizeRequest, CodeAuthenticateRequest as OAuth2CodeAuthenticateRequest } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/oauth2connect/v1/oauth2connect_proto/oauth2connect_pb'
import { AuthorizeRequest, CodeAuthenticateRequest } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/smsauthconnect/v1/smsauthconnect_proto/smsauthconnect_pb'
import { OAuth2Config } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/type/oauth2config/oauth2config_proto/oauth2config_pb'
import { SMSAuthConfig } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/type/smsauthconfig/smsauthconfig_proto/smsauthconfig_pb'
import { WXAuthConfig } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/type/wxauthconfig/wxauthconfig_proto/wxauthconfig_pb'
import { GetAccessTokenRequest, User } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/v1/authconnect_proto/authconnect_pb'
import { CodeAuthenticateRequest as WxCodeAuthenticateRequest, MiniProgramAuthenticateRequest, OAuth2AuthorizeRequest as WxOAuth2AuthorizeRequest, QRAuthorizeRequest } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/wxauthconnect/v1/wxauthconnect_proto/wxauthconnect_pb'
import { AddProductToFavoriteRequest, AddSKUToMyShoppingCartRequest, BatchGetPagesRequest, BatchGetPagesResponse, BatchGetPageComponentsRequest, BatchGetPageComponentsResponse, BatchGetProductsRequest, BatchGetProductsResponse, Brand, Color, CreateRecipientRequest, DeleteMyRecipientRequest, GetLandingPageRequest, GetMyCheckoutRequest, GetMyOrderRequest, GetMyProfileRequest, GetMyShoppingCartRequest, GetPageComponentRequest, GetPageRequest, GetProductRequest, IncreaseSKUQuantityInMyShoppingCartRequest, JoinStorefrontRequest, ListMyRecipientsRequest, ListMyRecipientsResponse, Material, MyCheckout, MyOrder, MyProfile, MyRecipient, MyShoppingCart, Page, PageComponent, Pattern, PayMyOrderWithPingppRequest, PingppPaymentCredential, PlaceOrderRequest, Product, ProductType, RemoveProductFromFavoriteRequest, RemoveSKUsFromMyShoppingCartRequest, SearchMyOrdersQuery, SearchMyOrdersRequest, SearchMyOrdersResponse, SearchProductsQuery, SearchProductsRequest, SearchProductsResponse, Storefront, UpdateDefaultRecipientRequest, UpdateMyCheckoutRequest, UpdateMyProfileRequest, UpdateMyRecipientRequest } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'

import { SuggestLocationsRequest } from '@xrc-inc/buy-sdk/ecnova/api/baidulbs/v1/baidulbs_proto/baidulbs_pb'
import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { LatLng } from '@xrc-inc/buy-sdk/ecnova/api/type/latlng/latlng_proto/latlng_pb'
import { Money } from '@xrc-inc/buy-sdk/google/type/money_pb'
import { PostalAddress } from '@xrc-inc/buy-sdk/google/type/postal_address_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'

// #region Buy

export function newGetPageComponentRequestFromObject(obj?: GetPageComponentRequest.AsObject): GetPageComponentRequest {
  throw new Error('Method not implemented')
}
export function newBatchGetPageComponentsRequestFromObject(obj?: BatchGetPageComponentsRequest.AsObject): BatchGetPageComponentsRequest {
  throw new Error('Method not implemented')
}
export function newBatchGetPageComponentsResponseFromObject(obj?: BatchGetPageComponentsResponse.AsObject): BatchGetPageComponentsResponse {
  throw new Error('Method not implemented')
}
export function newGetPageRequestFromObject(obj?: GetPageRequest.AsObject): GetPageRequest {
  const msg = new GetPageRequest()
  if (!obj) {
    return msg
  }
  msg.setName(obj.name)
  return msg
}
export function newBatchGetPagesRequestFromObject(obj?: BatchGetPagesRequest.AsObject): BatchGetPagesRequest {
  throw new Error('Method not implemented')
}
export function newBatchGetPagesResponseFromObject(obj?: BatchGetPagesResponse.AsObject): BatchGetPagesResponse {
  throw new Error('Method not implemented')
}
export function newPageComponentFromObject(obj?: PageComponent.AsObject): PageComponent {
  throw new Error('Method not implemented')
}
export function newPageFromObject(obj?: Page.AsObject): Page {
  throw new Error('Method not implemented')
}
export function newStorefrontFromObject(obj?: Storefront.AsObject): Storefront {
  throw new Error('Method not implemented')
}
export function newMyProfileFromObject(obj?: MyProfile.AsObject): MyProfile {
  throw new Error('Method not implemented')
}
export function newProductFromObject(obj?: Product.AsObject): Product {
  throw new Error('Method not implemented')
}
export function newDetailsMediaFromObject(obj?: Product.DetailsMedia.AsObject): Product.DetailsMedia {
  throw new Error('Method not implemented')
}
export function newVariantFromObject(obj?: Product.Variant.AsObject): Product.Variant {
  const msg = new Product.Variant()
  if (!obj) {
    return msg
  }
  msg.setSkuId(obj.skuId)
  msg.setProductType(newProductTypeFromObject(obj.productType))
  msg.setBrand(newBrandFromObject(obj.brand))
  msg.setTitle(obj.title)
  msg.setImageUrl(obj.imageUrl)
  msg.setAdditionalImageUrlsList(obj.additionalImageUrlsList)
  msg.setAvailability(obj.availability)
  msg.setPrice(newMoneyFromObject(obj.price))
  msg.setAdult(obj.adult)
  msg.setEnergyEfficiencyClass(obj.energyEfficiencyClass)
  msg.setMinEnergyEfficiencyClass(obj.minEnergyEfficiencyClass)
  msg.setMaxEnergyEfficiencyClass(obj.maxEnergyEfficiencyClass)
  msg.setAgeGroupsList(obj.ageGroupsList)
  msg.setColor(newColorFromObject(obj.color))
  msg.setGender(obj.gender)
  msg.setMaterial(newMaterialFromObject(obj.material))
  msg.setPattern(newPatternFromObject(obj.pattern))
  msg.setSize(obj.size)
  msg.setSizeType(obj.sizeType)
  msg.setSizeSystem(obj.sizeSystem)
  msg.setIsPhysical(obj.isPhysical)
  msg.setShippingWeight(obj.shippingWeight)
  msg.setShippingLabel(obj.shippingLabel)
  return msg
}
export function newBrandFromObject(obj?: Brand.AsObject): Brand {
  const msg = new Brand()
  if (!obj) {
    return msg
  }
  msg.setDescription(obj.description)
  msg.setId(obj.id)
  msg.setLogoUrl(obj.logoUrl)
  msg.setTitle(obj.title)
  return msg
}
export function newProductTypeFromObject(obj?: ProductType.AsObject): ProductType {
  const msg = new ProductType()
  if (!obj) {
    return msg
  }
  msg.setDescription(obj.description)
  msg.setId(obj.id)
  msg.setImageUrl(obj.imageUrl)
  msg.setTitle(obj.title)
  return msg
}

export function newColorFromObject(obj?: Color.AsObject): Color {
  const msg = new Color()
  if (!obj) {
    return msg
  }
  msg.setDescription(obj.description)
  msg.setId(obj.id)
  msg.setImageUrl(obj.imageUrl)
  msg.setDisplayName(obj.displayName)
  return msg
}
export function newPatternFromObject(obj?: Pattern.AsObject): Pattern {
  const msg = new Pattern()
  if (!obj) {
    return msg
  }
  msg.setDescription(obj.description)
  msg.setId(obj.id)
  msg.setImageUrl(obj.imageUrl)
  msg.setDisplayName(obj.displayName)
  return msg
}
export function newMaterialFromObject(obj?: Material.AsObject): Material {
  const msg = new Material()
  if (!obj) {
    return msg
  }
  msg.setDescription(obj.description)
  msg.setId(obj.id)
  msg.setImageUrl(obj.imageUrl)
  msg.setDisplayName(obj.displayName)
  return msg
}
export function newPingppPaymentCredentialFromObject(obj?: PingppPaymentCredential.AsObject): PingppPaymentCredential {
  throw new Error('Method not implemented')
}
export function newMyShoppingCartFromObject(obj?: MyShoppingCart.AsObject): MyShoppingCart {
  throw new Error('Method not implemented')
}
export function newMyShoppingCartLineItemFromObject(obj?: MyShoppingCart.LineItem.AsObject): MyShoppingCart.LineItem {
  const msg = new MyShoppingCart.LineItem()
  if (!obj) {
    return msg
  }
  msg.setDiscription(obj.discription)
  msg.setImageUrl(obj.imageUrl)
  msg.setPrice(newMoneyFromObject(obj.price))
  msg.setQuantity(obj.quantity)
  msg.setSkuId(obj.skuId)
  msg.setTitle(obj.title)
  msg.setUnavailable(obj.unavailable)
  msg.setVariant(newVariantFromObject(obj.variant))
  return msg
}
export function newMyCheckoutFromObject(obj?: MyCheckout.AsObject): MyCheckout {
  const msg = new MyCheckout()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  if (obj.lineItemsList) {
    msg.setLineItemsList(obj.lineItemsList.map(newMyCheckoutLineItemFromObject))
  }
  if (obj.shippingLinesList) {
    msg.setShippingLinesList(obj.shippingLinesList.map(newMyCheckoutShippingLineFromObject))
  }
  msg.setPhysicalProductsFulfillmentData(newMyCheckoutPhysicalProductsFulfillmentDataFromObject(obj.physicalProductsFulfillmentData))
  msg.setDigitalProductsFulfillmentData(newMyCheckoutDigitalProductsFulfillmentDataFromObject(obj.digitalProductsFulfillmentData))
  msg.setPaymentMethod(obj.paymentMethod)
  msg.setProductsSubtotal(newMoneyFromObject(obj.productsSubtotal))
  msg.setProductsDiscount(newMoneyFromObject(obj.productsDiscount))
  msg.setShippingSubtotal(newMoneyFromObject(obj.shippingSubtotal))
  msg.setShippingDiscount(newMoneyFromObject(obj.shippingDiscount))
  msg.setGrandTotal(newMoneyFromObject(obj.grandTotal))
  msg.setIsValid(obj.isValid)
  msg.setCnDigitalInvoice(newCNDigitalInvoiceFromObject(obj.cnDigitalInvoice))
  msg.setCustomerComments(obj.customerComments)
  return msg
}
export function newMyCheckoutLineItemFromObject(obj?: MyCheckout.LineItem.AsObject): MyCheckout.LineItem {
  const msg = new MyCheckout.LineItem()
  if (!obj) {
    return msg
  }
  msg.setSkuId(obj.skuId)
  msg.setTitle(obj.title)
  msg.setImageUrl(obj.imageUrl)
  msg.setPrice(newMoneyFromObject(obj.price))
  msg.setQuantity(obj.quantity)
  msg.setUnavailable(obj.unavailable)
  msg.setShippingLabel(obj.shippingLabel)
  msg.setShipppingWeight(obj.shipppingWeight)
  msg.setVariant(newVariantFromObject(obj.variant))
  return msg
}
export function newMyCheckoutShippingLineFromObject(obj?: MyCheckout.ShippingLine.AsObject): MyCheckout.ShippingLine {
  const msg = new MyCheckout.ShippingLine()
  if (!obj) {
    return msg
  }
  msg.setShippingLabel(obj.shippingLabel)
  msg.setShippingDescription(obj.shippingDescription)
  msg.setParcelNumbers(obj.parcelNumbers)
  msg.setSubtotal(newMoneyFromObject(obj.subtotal))
  return msg
}
export function newMyCheckoutPhysicalProductsFulfillmentDataFromObject(obj?: MyCheckout.PhysicalProductsFulfillmentData.AsObject): MyCheckout.PhysicalProductsFulfillmentData {
  const msg = new MyCheckout.PhysicalProductsFulfillmentData()
  if (!obj) {
    return msg
  }
  msg.setDeliveryOption(obj.deliveryOption)
  msg.setRecipient(newMyRecipientFromObject(obj.recipient))
  return msg
}
export function newMyCheckoutDigitalProductsFulfillmentDataFromObject(obj?: MyCheckout.DigitalProductsFulfillmentData.AsObject): MyCheckout.DigitalProductsFulfillmentData {
  const msg = new MyCheckout.DigitalProductsFulfillmentData()
  if (!obj) {
    return msg
  }
  msg.setEmail(obj.email)
  return msg
}
export function newCNDigitalInvoiceFromObject(obj?: MyCheckout.CNDigitalInvoice.AsObject): MyCheckout.CNDigitalInvoice {
  const msg = new MyCheckout.CNDigitalInvoice()
  if (!obj) {
    return msg
  }
  msg.setCompany(newMyCheckoutCNDigitalInvoiceCompanyFromObject(obj.company))
  msg.setEmail(obj.email)
  msg.setPerson(obj.person)
  msg.setSmsTextReceivePhoneNumber(obj.smsTextReceivePhoneNumber)
  msg.setType(obj.type)
  return msg
}
export function newMyCheckoutCNDigitalInvoiceCompanyFromObject(obj?: MyCheckout.CNDigitalInvoice.Company.AsObject): MyCheckout.CNDigitalInvoice.Company {
  const msg = new MyCheckout.CNDigitalInvoice.Company()
  if (!obj) {
    return msg
  }
  msg.setFullName(obj.fullName)
  msg.setTaxPayerId(obj.taxPayerId)
  return msg
}
export function newMyOrderFromObject(obj?: MyOrder.AsObject): MyOrder {
  throw new Error('Method not implemented')
}
export function newMyOrderLineItemFromObject(obj?: MyOrder.LineItem.AsObject): MyOrder.LineItem {
  throw new Error('Method not implemented')
}
export function newMyOrderInvoiceFromObject(obj?: MyOrder.Invoice.AsObject): MyOrder.Invoice {
  throw new Error('Method not implemented')
}
export function newMyOrderFulfillmentOrderFromObject(obj?: MyOrder.FulfillmentOrder.AsObject): MyOrder.FulfillmentOrder {
  throw new Error('Method not implemented')
}
export function newMyOrderFulfillmentOrderParcelFromObject(obj?: MyOrder.FulfillmentOrder.Parcel.AsObject): MyOrder.FulfillmentOrder.Parcel {
  throw new Error('Method not implemented')
}
export function newPaymentFromObject(obj?: MyOrder.Payment.AsObject): MyOrder.Payment {
  throw new Error('Method not implemented')
}
export function newGetMyProfileRequestFromObject(obj?: GetMyProfileRequest.AsObject): GetMyProfileRequest {
  const msg = new GetMyProfileRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  return msg
}
export function newJoinStorefrontRequestFromObject(obj?: JoinStorefrontRequest.AsObject): JoinStorefrontRequest {
  const msg = new JoinStorefrontRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  return msg
}
export function newUpdateMyProfileRequestFromObject(obj?: UpdateMyProfileRequest.AsObject): UpdateMyProfileRequest {
  throw new Error('Method not implemented')
}
export function newGetProductRequestFromObject(obj?: GetProductRequest.AsObject): GetProductRequest {
  const msg = new GetProductRequest()
  if (!obj) {
    return msg
  }
  msg.setName(obj.name)
  return msg
}
export function newBatchGetProductsRequestFromObject(obj?: BatchGetProductsRequest.AsObject): BatchGetProductsRequest {
  const msg = new BatchGetProductsRequest()
  if (!obj) {
    return msg
  }
  msg.setNamesList(obj.namesList)
  msg.setStorefront(obj.storefront)
  return msg
}
export function newBatchGetProductsResponseFromObject(obj?: BatchGetProductsResponse.AsObject): BatchGetProductsResponse {
  throw new Error('Method not implemented')
}
export function newSearchProductsRequestFromObject(obj?: SearchProductsRequest.AsObject): SearchProductsRequest {
  const msg = new SearchProductsRequest()
  if (!obj) {
    return msg
  }
  msg.setPageSize(obj.pageSize)
  msg.setPageToken(obj.pageToken)
  msg.setQuery(newSearchProductsQueryFromObject(obj.query))
  msg.setStorefront(obj.storefront)
  return msg
}
export function newSearchProductsResponseFromObject(obj?: SearchProductsResponse.AsObject): SearchProductsResponse {
  throw new Error('Method not implemented')
}
export function newSearchProductsQueryFromObject(obj?: SearchProductsQuery.AsObject): SearchProductsQuery {
  const msg = new SearchProductsQuery()
  if (!obj) {
    return msg
  }
  msg.setCollection(obj.collection)
  msg.setKeyword(obj.keyword)
  msg.setProductType(obj.productType)
  return msg
}
export function newAddProductToFavoriteRequestFromObject(obj?: AddProductToFavoriteRequest.AsObject): AddProductToFavoriteRequest {
  throw new Error('Method not implemented')
}
export function newRemoveProductFromFavoriteRequestFromObject(obj?: RemoveProductFromFavoriteRequest.AsObject): RemoveProductFromFavoriteRequest {
  throw new Error('Method not implemented')
}
export function newCreateRecipientRequestFromObject(obj?: CreateRecipientRequest.AsObject): CreateRecipientRequest {
  const msg = new CreateRecipientRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  msg.setRecipient(newMyRecipientFromObject(obj.recipient))
  return msg
}
export function newUpdateMyRecipientRequestFromObject(obj?: UpdateMyRecipientRequest.AsObject): UpdateMyRecipientRequest {
  const msg = new UpdateMyRecipientRequest()
  if (!obj) {
    return msg
  }
  msg.setMyRecipient(newMyRecipientFromObject(obj.myRecipient))
  return msg
}
export function newMyRecipientFromObject(obj?: MyRecipient.AsObject): MyRecipient {
  const msg = new MyRecipient()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  msg.setRecipientId(obj.recipientId)
  msg.setFullName(obj.fullName)
  msg.setPhoneNumber(obj.phoneNumber)
  msg.setEmail(obj.email)
  msg.setLatLng(newLatLngRequestFromObject(obj.latLng))
  msg.setPostalAddress(newPostalAddressFromObject(obj.postalAddress))
  return msg
}
export function newPostalAddressFromObject(obj?: PostalAddress.AsObject): PostalAddress {
  const msg = new PostalAddress()
  if (!obj) {
    return msg
  }
  msg.setRevision(obj.revision)
  msg.setRegionCode(obj.regionCode)
  msg.setLanguageCode(obj.languageCode)
  msg.setPostalCode(obj.postalCode)
  msg.setSortingCode(obj.sortingCode)
  msg.setAdministrativeArea(obj.administrativeArea)
  msg.setLocality(obj.locality)
  msg.setSublocality(obj.sublocality)
  msg.setAddressLinesList(obj.addressLinesList)
  msg.setRecipientsList(obj.recipientsList)
  msg.setOrganization(obj.organization)
  return msg
}
export function newListMyRecipientsRequestFromObject(obj?: ListMyRecipientsRequest.AsObject): ListMyRecipientsRequest {
  const msg = new ListMyRecipientsRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  return msg
}
export function newListMyRecipientsResponseFromObject(obj?: ListMyRecipientsResponse.AsObject): ListMyRecipientsResponse {
  throw new Error('Method not implemented')
}
export function newDeleteMyRecipientRequestFromObject(obj?: DeleteMyRecipientRequest.AsObject): DeleteMyRecipientRequest {
  const msg = new DeleteMyRecipientRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  msg.setRecipientId(obj.recipientId)
  return msg
}
export function newUpdateDefaultRecipientRequestFromObject(obj?: UpdateDefaultRecipientRequest.AsObject): UpdateDefaultRecipientRequest {
  const msg = new UpdateDefaultRecipientRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  msg.setRecipientId(obj.recipientId)
  return msg
}
export function newGetMyShoppingCartRequestFromObject(obj?: GetMyShoppingCartRequest.AsObject): GetMyShoppingCartRequest {
  const msg = new GetMyShoppingCartRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  msg.setView(obj.view)
  return msg
}
export function newAddSKUToMyShoppingCartRequestFromObject(obj?: AddSKUToMyShoppingCartRequest.AsObject): AddSKUToMyShoppingCartRequest {
  const msg = new AddSKUToMyShoppingCartRequest()
  if (!obj) {
    return msg
  }
  msg.setName(obj.name)
  msg.setQuantity(obj.quantity)
  return msg
}
export function newIncreaseSKUQuantityInMyShoppingCartRequestFromObject(obj?: IncreaseSKUQuantityInMyShoppingCartRequest.AsObject): IncreaseSKUQuantityInMyShoppingCartRequest {
  const msg = new IncreaseSKUQuantityInMyShoppingCartRequest()
  if (!obj) {
    return msg
  }
  msg.setName(obj.name)
  msg.setQuantity(obj.quantity)
  return msg
}
export function newRemoveSKUsFromMyShoppingCartRequestFromObject(obj?: RemoveSKUsFromMyShoppingCartRequest.AsObject): RemoveSKUsFromMyShoppingCartRequest {
  const msg = new RemoveSKUsFromMyShoppingCartRequest()
  if (!obj) {
    return msg
  }
  msg.setNamesList(obj.namesList)
  msg.setStorefront(obj.storefront)
  return msg
}
export function newPayMyOrderWithPingppRequestFromObject(obj?: PayMyOrderWithPingppRequest.AsObject): PayMyOrderWithPingppRequest {
  const msg = new PayMyOrderWithPingppRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  msg.setOrderId(obj.orderId)
  if (obj.alipay) {
    msg.setAlipay(newPayMyOrderWithPingppRequestAlipayFromObject(obj.alipay))
  } else if (obj.wxWap) {
    msg.setWxWap(newPayMyOrderWithPingppRequestWxWapFromObject(obj.wxWap))
  } else if (obj.alipayWap) {
    msg.setAlipayWap(newAlipayWapFromObject(obj.alipayWap))
  } else if (obj.wxPub) {
    msg.setWxPub(newWxPubFromObject(obj.wxPub))
  }
  return msg
  // throw new Error('Method not implemented')
}
export function newPayMyOrderWithPingppRequestAlipayFromObject(obj?: PayMyOrderWithPingppRequest.Alipay.AsObject): PayMyOrderWithPingppRequest.Alipay {
  const msg = new PayMyOrderWithPingppRequest.Alipay()
  if (!obj) {
    return msg
  }
  return msg
}
export function newWxPubFromObject(obj?: PayMyOrderWithPingppRequest.WxPub.AsObject): PayMyOrderWithPingppRequest.WxPub {
  const msg = new PayMyOrderWithPingppRequest.WxPub()
  if (!obj) {
    return msg
  }
  msg.setOpenId(obj.openId)
  return msg
}
export function newAlipayWapFromObject(obj?: PayMyOrderWithPingppRequest.AlipayWap.AsObject): PayMyOrderWithPingppRequest.AlipayWap {
  const msg = new PayMyOrderWithPingppRequest.AlipayWap()
  if (!obj) {
    return msg
  }
  msg.setCancelUrl(obj.cancelUrl)
  msg.setSuccessUrl(obj.successUrl)
  msg.setUseAppPay(obj.useAppPay)
  return msg
}
export function newPayMyOrderWithPingppRequestAlipayQrFromObjectWap(obj?: PayMyOrderWithPingppRequest.AlipayQr.AsObject): PayMyOrderWithPingppRequest.AlipayQr {
  throw new Error('Method not implemented')

}
export function newPayMyOrderWithPingppRequestAlipayPcDirectFromObject(obj?: PayMyOrderWithPingppRequest.AlipayPcDirect.AsObject): PayMyOrderWithPingppRequest.AlipayPcDirect {
  throw new Error('Method not implemented')
}
export function newWxFromObject(obj?: PayMyOrderWithPingppRequest.Wx.AsObject): PayMyOrderWithPingppRequest.Wx {
  throw new Error('Method not implemented')
}
export function newPayMyOrderWithPingppRequestWxPubFromObject(obj?: PayMyOrderWithPingppRequest.WxPub.AsObject): PayMyOrderWithPingppRequest.WxPub {
  throw new Error('Method not implemented')
}
export function newPayMyOrderWithPingppRequestWxLiteFromObject(obj?: PayMyOrderWithPingppRequest.WxLite.AsObject): PayMyOrderWithPingppRequest.WxLite {
  const msg = new PayMyOrderWithPingppRequest.WxLite()
  if (!obj) {
    return msg
  }
  msg.setOpenId(obj.openId)
  return msg
}
export function newPayMyOrderWithPingppRequestWxWapFromObject(obj?: PayMyOrderWithPingppRequest.WxWap.AsObject): PayMyOrderWithPingppRequest.WxWap {
  throw new Error('Method not implemented')
}
export function newPayMyOrderWithPingppRequestWxPubQrFromObject(obj?: PayMyOrderWithPingppRequest.WxPubQr.AsObject): PayMyOrderWithPingppRequest.WxPubQr {
  throw new Error('Method not implemented')
}
export function newSearchMyOrdersRequestFromObject(obj?: SearchMyOrdersRequest.AsObject): SearchMyOrdersRequest {
  const msg = new SearchMyOrdersRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  msg.setPageSize(obj.pageSize)
  msg.setPageToken(obj.pageToken)
  const query = newSearchMyOrdersQueryFromObject(obj.query)
  msg.setQuery(query)
  return msg
}
export function newSearchMyOrdersResponseFromObject(obj?: SearchMyOrdersResponse.AsObject): SearchMyOrdersResponse {
  throw new Error('Method not implemented')
}
export function newSearchMyOrdersQueryFromObject(obj?: SearchMyOrdersQuery.AsObject): SearchMyOrdersQuery {
  const msg = new SearchMyOrdersQuery()
  if (!obj) {
    return msg
  }
  msg.setKeyword(obj.keyword)
  msg.setPaymentStatus(obj.paymentStatus)
  msg.setShippingStatus(obj.shippingStatus)
  msg.setReceiptStatus(obj.receiptStatus)
  msg.setOrderStatus(obj.orderStatus)
  return msg
}
export function newGetMyOrderRequestFromObject(obj?: GetMyOrderRequest.AsObject): GetMyOrderRequest {
  const msg = new GetMyOrderRequest()
  if (!obj) {
    return msg
  }
  msg.setOrderId(obj.orderId)
  msg.setStorefront(obj.storefront)
  return msg
}
export function newUpdateMyCheckoutRequestFromObject(obj?: UpdateMyCheckoutRequest.AsObject): UpdateMyCheckoutRequest {
  const msg = new UpdateMyCheckoutRequest()
  if (!obj) {
    return msg
  }
  msg.setMyCheckout(newMyCheckoutFromObject(obj.myCheckout))
  msg.setStorefront(obj.storefront)
  return msg
}
export function newGetMyCheckoutRequestFromObject(obj?: GetMyCheckoutRequest.AsObject): GetMyCheckoutRequest {
  throw new Error('Method not implemented')
}
export function newPlaceOrderRequestFromObject(obj?: PlaceOrderRequest.AsObject): PlaceOrderRequest {
  const msg = new PlaceOrderRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  msg.setMyCheckout(newMyCheckoutFromObject(obj.myCheckout))
  return msg
}
export function newGetLandingPageRequestFromObject(obj?: GetLandingPageRequest.AsObject): GetLandingPageRequest {
  const msg = new GetLandingPageRequest()
  if (!obj) {
    return msg
  }
  msg.setStorefront(obj.storefront)
  return msg
}

// #endregion

// #region Auth
export function newWxOAuth2AuthorizeRequestFromObject(obj?: WxOAuth2AuthorizeRequest.AsObject): WxOAuth2AuthorizeRequest {
  const msg = new WxOAuth2AuthorizeRequest()
  if (!obj) {
    return msg
  }
  msg.setAuthConn(obj.authConn)
  msg.setRedirectUrl(obj.redirectUrl)
  return msg
}
export function newWxCodeAuthenticateRequestFromObject(obj?: WxCodeAuthenticateRequest.AsObject): WxCodeAuthenticateRequest {
  const msg = new WxCodeAuthenticateRequest()
  if (!obj) {
    return msg
  }
  msg.setAuthConn(obj.authConn)
  msg.setCode(obj.code)
  msg.setState(obj.state)
  return msg
}
export function newGetAccessTokenRequestFromObject(obj?: GetAccessTokenRequest.AsObject): GetAccessTokenRequest {
  const msg = new GetAccessTokenRequest()
  if (!obj) {
    return msg
  }
  msg.setAudience(obj.audience)
  msg.setScopesList(obj.scopesList)
  return msg
}
export function newUserFromObject(obj?: User.AsObject): User {
  throw new Error('Method not implemented')
}
export function newAuthorizeRequestFromObject(obj?: AuthorizeRequest.AsObject): AuthorizeRequest {
  throw new Error('Method unimplemented')
}
export function newCodeAuthenticateRequestFromObject(obj?: CodeAuthenticateRequest.AsObject): CodeAuthenticateRequest {
  throw new Error('Method unimplemented')
}
export function newOAuth2AuthorizeRequestRequestFromObject(obj?: OAuth2AuthorizeRequest.AsObject): OAuth2AuthorizeRequest {
  throw new Error('Method unimplemented')
}
export function newOAuth2CodeAuthenticateRequestFromObject(obj?: OAuth2CodeAuthenticateRequest.AsObject): OAuth2CodeAuthenticateRequest {
  const msg = new OAuth2CodeAuthenticateRequest()
  if (!obj) {
    return msg
  }
  msg.setAuthConn(obj.authConn)
  msg.setCode(obj.code)
  msg.setState(obj.state)
  return msg
}
export function newOAuth2AuthenticateRequestFromObject(obj?: OAuth2AuthenticateRequest.AsObject): OAuth2AuthenticateRequest {
  const msg = new OAuth2AuthenticateRequest()
  if (!obj) {
    return msg
  }
  msg.setAuthConn(obj.authConn)
  msg.setAccessToken(newAccessTokenFromObject(obj.accessToken))
  return msg
}
export function newOAuth2ConfigFromObject(obj?: OAuth2Config.AsObject): OAuth2Config {
  throw new Error('Method unimplemented')
}
export function newSMSAuthConfigFromObject(obj?: SMSAuthConfig.AsObject): SMSAuthConfig {
  throw new Error('Method unimplemented')
}
export function newWXAuthConfigFromObject(obj?: WXAuthConfig.AsObject): WXAuthConfig {
  throw new Error('Method unimplemented')
}
export function newOAuth2AuthorizeRequestFromObject(obj?: OAuth2AuthorizeRequest.AsObject): OAuth2AuthorizeRequest {
  const msg = new OAuth2AuthorizeRequest()
  if (!obj) {
    return msg
  }
  msg.setAuthConn(obj.authConn)
  msg.setRedirectUrl(obj.redirectUrl)
  return msg
}
export function newQRAuthorizeRequestFromObject(obj?: QRAuthorizeRequest.AsObject): QRAuthorizeRequest {
  throw new Error('Method unimplemented')
}
export function newMiniProgramAuthenticateRequestFromObject(obj?: MiniProgramAuthenticateRequest.AsObject): MiniProgramAuthenticateRequest {
  throw new Error('Method unimplemented')
}

// #endregion

export function newAccessTokenFromObject(obj?: Token.AsObject): Token {
  const msg = new Token()
  if (!obj) {
    return msg
  }
  msg.setExpiry(newTimestampFromObject(obj.expiry))
  msg.setOpaque(obj.opaque)
  msg.setType(obj.type)
  return msg
}

export function newMoneyFromObject(obj?: Money.AsObject): Money {
  const msg = new Money()
  if (!obj) {
    return msg
  }
  msg.setCurrencyCode(obj.currencyCode)
  msg.setNanos(obj.nanos)
  msg.setUnits(obj.units)
  return msg
}

export function newTimestampFromObject(obj?: Timestamp.AsObject): Timestamp {
  const msg = new Timestamp()
  if (!obj) {
    return msg
  }
  msg.setNanos(obj.nanos)
  msg.setSeconds(obj.seconds)
  return msg
}
export function newSuggestLocationsRequestFromObject(obj?: SuggestLocationsRequest.AsObject): SuggestLocationsRequest {
  const msg = new SuggestLocationsRequest()
  if (!obj) {
    return msg
  }
  msg.setQuery(obj.query)
  msg.setRegion(obj.region)
  msg.setShowLocationsInRegionOnly(obj.showLocationsInRegionOnly)
  msg.setGeolocation(newLatLngRequestFromObject(obj.geolocation))
  return msg
}
export function newLatLngRequestFromObject(obj?: LatLng.AsObject): LatLng {
  const msg = new LatLng()
  if (!obj) {
    return msg
  }
  msg.setLatitude(obj.latitude)
  msg.setLongitude(obj.longitude)
  msg.setGeoCoordinateSystem(obj.geoCoordinateSystem)
  return msg
}
