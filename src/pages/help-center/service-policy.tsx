import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { IconChevronRight } from '../../components/icons'
import { IUIStateProps } from '../../store'

@inject('ui')
@observer
export class ServicePolicyPage extends React.Component<IUIStateProps> {
  constructor(props: IUIStateProps) {
    super(props)
    props.ui!.setNavigationBarTitle('服务政策')
  }
  public render() {
    return (
      <div className="help-center-page">
        <ul className="list-view">
          <li><Link to="/help/service-policy/1">交易条款<IconChevronRight /></Link></li>
          <li><Link to="/help/service-policy/2">隐私政策<IconChevronRight /></Link></li>
          <li><Link to="/help/service-policy/3">商务合作<IconChevronRight /></Link></li>
        </ul>
      </div>
    )
  }
}

interface ISectionProps extends RouteComponentProps<{ section: number }> {

}

export class ServicePolicySection extends React.Component<ISectionProps> {
  public render() {
    return (
      <div className="help-center-page help-center-content">
        {[
          交易条款,
          隐私政策,
          商务合作,
        ][this.props.match.params.section - 1]}
      </div>
    )
  }
}

const 交易条款 = (
  <div>
    <h2>交易条款</h2>
    <p>
      欢迎使用闪送商城（以下简称“本商城”），为了保障您（以下简称“用户”）的权益，
      <b>
        请在使用本商城服务之前，详细阅读此服务协议（以下简称“本协议“）所有内容，特别是加粗部分。当用户开始使用本商城服务，用户的行为表示用户同意并签署了本协议，构成用户与本商城之间的协议，具有合同效力。
      </b>
    </p>
    <p>
      本协议内容包括协议正文、本协议明确援引的其他协议、本商城已经发布的或将来可能发布的各类规则，该等内容均为本协议不可分割的组成部分，与协议正文具有同等法律效力。除另行明确声明外，用户使用本商城服务均受本协议约束。
    </p>
    <h3>一、定义</h3>
    <ul>
      <li>
        1、闪送商城是由北京必应快递有限公司及最前台科技联合运营的电商平台。用户登录本商城后，可以浏览平台上商家发布的商品和服务信息，进行、商品和/或服务交易等活动。
      </li>
      <li>
        2、商家是指通过本商城平台陈列、销售商品或服务，并最终和用户完成交易的主体，是商品和服务的提供方和销售方。
      </li>
    </ul>
    <h3>二、服务协议的修订</h3>
    <p>
      <b>
        本商城有权在必要时通过在平台发出公告等合理方式修改本条款。用户在使用本商城服务时，应当及时查阅了解修改的内容，并自觉遵守本协议的相关内容。用户如继续使用本商城，则视为对修改内容的同意，当发生有关争议时，以最新的服务协议为准；用户在不同意修改内容的情况下，有权停止使用本协议涉及的服务。
      </b>
    </p>
    <h3>三、服务规范</h3>
    <ul>
      <li>
        1、本商城是为用户提供获取商品和服务信息、就商品和服务的交易进行协商及开展交易的第三方平台，并非商品和服务的提供方或销售方，平台上的所有商品和服务由商家向用户提供，并由商家承担其商品和服务（以下统称为“商品”）的质量保证责任。
      </li>
      <li>
        2、除法律规定或者本商城上公示的承诺外，本商城将不对所提供的商品的适用性或满足用户特定需求及目的进行任何明示或者默示的担保。请用户在购买前确认自身的需求，同时仔细阅读商品详情说明。本商城会督促商家对其在平台上展示的商品提供真实、准确、完整的信息，但不能保证平台上所有商品的相关内容均为准确完整、真实有效的信息，亦不承担因商品信息导致的任何责任。
      </li>
      <li>
        3、商家将根据国家法律法规及本商城上公布的售后服务政策向用户提供售后保障。本商城的售后服务政策为本协议的组成部分，本商城有权以声明、通知或其他形式变更售后服务政策。
      </li>
      <li>
        4、用户同意并保证：为了更好的为用户提供服务，本商城有权记录用户在选购商品过程中在线填写的所有信息，并提供给商家或本商城的关联公司。用户保证该等信息准确、合法，该等信息将作为用户本次交易的不可撤销的承诺，用户承担因该等信息错误、非法等导致的后果。如用户提供的信息过期、无效进而导致商家或本商城无法与用户取得联系的，因此导致用户在使用本商城服务中产生任何损失或增加费用的，应由用户完全独自承担。
      </li>
      <li>
        5、用户了解并同意，本商城有权应有关部门的要求，向其提供用户提交给本商城或用户在使用服务中存储于服务器的必要信息。如用户涉嫌侵犯他人合法权益，则本商城有权在初步判断涉嫌侵权行为存在的情况下，向权利人提供关于用户的前述必要信息。
      </li>
      <li>
        6、除非另有证明，储存在服务器上的数据是用户使用本商城服务的唯一有效证据。
      </li>
      <li>
        7、除法律另有规定外，本商城保留自行决定是否提供服务、限制账户权限、编辑或清除网页内容以及取消用户订单的权利。
      </li>
    </ul>
    <h3>四、平台使用规则</h3>
    <ul>
      <li>
        <p>
          1、用户可浏览本商城上的商品信息，如用户希望完成选购并支付订单的，用户需先登录或注册本商城认可的帐号后进行登录，并根据页面提示提交选购的商品信息，包括但不限于商品数量、交付所需的收货人信息。用户在提交订单时登录的帐号和密码是本商城确认用户身份的唯一依据。
        </p>
      </li>
      <li>
        <p>
          2、用户有权选择使用本商城接受的支付方式，用户理解并确认部分支付服务由本商城之外具备合法资质的第三方为用户提供，该等支付服务的使用条件及规范由用户与支付服务提供方确定，与本商城无关。某些支付方式可能需要在支付时验证用户的本商城的支付密码，用户如未设置支付密码，本商城将引导用户进行设置。
        </p>
      </li>
      <li>
        <p>
          3、用户确认：在使用本商城服务过程中，用户应当是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织。若用户不具备前述主体资格，则用户及用户的监护人应承担因此而导致的一切后果，本商城有权向用户的监护人追偿。
        </p>
      </li>
      <li>
        <p>
          4、用户应保管好自己的帐号和密码，如因用户未保管好自己的帐号和密码而对自己、本商城或第三方造成损害的，用户将负全部责任。另外，用户应对自己帐号中的所有活动和事件负全责。用户有权随时改变帐号的登录密码及/或支付密码。
        </p>
      </li>
      <li>
        <p>
          5、用户在使用本商城服务时填写、登录、使用的帐号名称、头像、个人简介等帐号信息资料应遵守法律法规、社会主义制度、国家利益、公民合法权益、公共秩序、社会道德风尚和信息真实性等七条底线，不得在帐号信息资料中出现违法和不良信息，且用户保证在填写、登录、使用帐号信息资料时，不得有以下情形：
        </p>
        <li>
          <p>（1）违反宪法或法律法规规定的；</p>
        </li>
        <li>
          <p>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
        </li>
        <li>
          <p>（3）损害国家荣誉和利益的，损害公共利益的；</p>
        </li>
        <li>
          <p>（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p>
        </li>
        <li>
          <p>（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
        </li>
        <li>
          <p>（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
        </li>
        <li>
          <p>（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
        </li>
        <li>
          <p>（8）侮辱或者诽谤他人，侵害他人合法权益的；</p>
        </li>
        <li>
          <p>（9）含有法律、行政法规禁止的其他内容的。</p>
        </li>
        <p>
          若用户登录、使用帐号头像、个人简介等帐号信息资料存在违法和不良信息的，本商城有权采取通知限期改正、暂停使用等措施。对于冒用关联机构或社会名人登录、使用、填写帐号名称、头像、个人简介的，本商城有权取消该帐号在平台上使用，并向政府主管部门进行报告。
        </p>
      </li>
      <li>
        <p>
          6、本商城上的商品和服务的价格、数量等信息随时可能发生变动，对此本商城不作特别通知。由于平台上的商品的数量庞大、互联网技术因素等客观原因存在，平台上显示的信息可能存在一定的滞后和误差，对此请用户知悉并理解。为最大限度的提高平台上商品信息的准确性、及时性、完整性和有效性，本商城有权对商品信息进行及时的监测、修改或删除。如用户提交订单后，本商城发现平台的相关页面上包括但不限于商品名称、价格或数量价格等关键信息存在标注错误的，有权取消错误订单并及时通知商家和用户。
        </p>
      </li>
      <li>
        <p>
          7、在用户提交订单时，收货人与用户本人不一致的，收货人的行为和意思表示视为用户的行为和意思表示，用户应对收货人的行为及意思表示的法律后果承担连带责任。
        </p>
      </li>
      <li>
        <p>
          8、用户理解并同意：本商城实行先付款后发货的方式，用户及时、足额、合法的支付选购商品所需的款项是商家给用户发货的前提。付款方式将在本商城予以公示。用户应在确认订单时，选择付款方式，并严格按照已选择的方式付款。用户未能按照所选择的方式或在指定时间完成付款的，本商城有权取消订单。
        </p>
      </li>
      <li>
        <p>9、除法律另有规定强制性规定外，用户理解并同意以下订单成立规则：</p>
        <ul>
          <li>
            <p>
              （1）本商城上展示的商品及其价格、规格等信息仅是商家发布的供用户浏览参考的交易信息，用户下单时须填写希望购买的商品数量、价款及支付方式、收货人、联系方式、收货地址等具体内容，系统将根据用户填写的前述必要信息自动生成相应订单，用户确认无误后可提交订单。该订单仅是用户向商家发出的希望购买特定商品的交易诉求。
            </p>
          </li>
          <li>
            <p>
              （2）商城系统将用户提交的订单反馈至商家，经商家确认并将订单中选购的商品向用户或用户指定的收货人发出时（以订单显示的状态为准），方视为用户和商家之间就实际发出的商品建立合同关系。如用户在一份订单中购买了多个商品但商家实际只发出了部分商品时，用户和商家直接仅就实际发出的商品建立合同关系。
            </p>
          </li>
          <li>
            <p>
              （3）由于市场变化及各种以合理商业努力难以控制的因素的影响，本商城无法保证用户提交的订单信息中选购的商品都有库存；如用户拟购买的商品发生缺货，用户有权取消订单。
            </p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          10、用户应当保证在使用本商城进行交易过程中遵守诚实信用的原则。用户支付交易款项过程中，将被邀请复查选购商品的信息，包括单价、购买数量、付款方式、商品的运输方式和费用等。请用户仔细确认该等信息。该存储于本商城服务器的订单表格被认为是用户的该次交易对应的发货、退货和争议事项的证据。用户点击“提交订单”意味着用户认可订单表格中包含的所有信息都是正确、合法和完整的，用户须对用户在使用本商城过程中的上述行为承担法律责任。
        </p>
      </li>
      <li>
        <p>
          11、用户所选购的商品将被送至订单表格上注明的送货地址，具体物流服务由北京必应快递有限公司提供，本商城不承担责任。无论何种原因该商品不能送达到送货地址，请用户尽快与本商城客服取得联系，本商城将会同商家进行解决。
        </p>
      </li>
      <li>
        <p>
          12、用户可以随时使用自己的帐号和登录密码登录本商城，查询订单状态。
        </p>
      </li>
      <li>
        <p>
          13、商家在本商城上列出的所有送货时间仅为参考时间，如因以下情况造成订单延迟或无法配送、交货等，商家不承担延迟配送、交货的责任，并有权在必要时取消订单：
        </p>
        <ul>
          <li>
            <p>（1）用户提供的信息错误、地址不详细等原因导致的；</p>
          </li>
          <li>
            <p>（2） 货物送达后无人签收，导致无法配送或延迟配送的；</p>
          </li>
          <li>
            <p>（3）情势变更因素导致的；</p>
          </li>
          <li>
            <p>（4）因节假日、大型促销活动、预购或抢购人数众多等原因导致的；</p>
          </li>
          <li>
            <p>
              （5）不可抗力因素导致的，例如：自然灾害、交通戒严、突发战争等。
            </p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          14、用户有权在本商城上发布内容，同时也有义务独立承担用户在本商城所发布内容的责任。用户发布的内容必须遵守法律法规及其他相关规定。用户承诺不得发布以下内容，否则一经发现本商城有义务立即停止传输，保存有关记录，向国家有关机关报告，并且删除该内容或停止用户的帐号的使用权限。
        </p>
        <ul>
          <li>
            <p>（1）侵犯他人知识产权或其他合法权利的相关内容；</p>
          </li>
          <li>
            <p>
              （2）透露他人隐私信息，包含真实姓名、联系方式、家庭住址、照片、站内短信、聊天记录、社交网络帐号等；
            </p>
          </li>
          <li>
            <p>（3）发布商业广告或在评论区域发布广告链接；</p>
          </li>
          <li>
            <p>（4）相关法律、行政法规禁止的其他内容。</p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          15、本商城进行优惠、促销的目的是为满足广大的消费需求，一切以牟利、排挤竞争为意图或者为达到其它恶意目的的参与行为均不予接受。若用户存在以下不正当行为，
          一经发现本商城有权会同商家采取包括但不限于暂停发货、取消订单、拦截已发货的订单、限制账户权限等措施：
        </p>
        <ul>
          <li>
            <p>（1）用户将自有账户内的优惠、促销信息转卖、转让予他人；</p>
          </li>
          <li>
            <p>
              （2）用户通过本商城及其合作商的合法活动页面之外的第三方交易渠道获得优惠券并在本商城进行使用；
            </p>
          </li>
          <li>
            <p>（3）用户在本商城通过机器手段恶意批量刷取优惠券并进行使用；</p>
          </li>
          <li>
            <p>
              （4）用户利用软件、技术手段或其他方式在本商城套取商品、优惠券、运费或者其他利益；
            </p>
          </li>
          <li>
            <p>（5）本商城认定的其他不正当行为。</p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          16、用户可将其与商家因交易行为产生的争议提交本商城，提交即视为用户委托本商城单方判断与该争议相关的事实及应适用的规则，进而作出处理决定。该判断和决定将对用户产生约束力。但用户理解并同意，本商城并非司法机构，仅是基于用户委托以中立第三方身份进行争议处理，无法保证处理结果符合用户的预期，也不对处理结果承担任何责任。如用户因此遭受损失，用户同意自行向责任方追偿。
        </p>
      </li>
    </ul>
    <h3>五、其他约定</h3>
    <ul>
      <li>
        <p>1、责任范围</p>
        <p>
          本商城对不可抗力导致的损失不承担责任。本协议所指不可抗力包括：天灾、法律法规或政府指令的变更，因网络服务特性而特有的原因，例如境内外基础电信运营商的故障、计算机或互联网相关技术缺陷、互联网覆盖范围限制、计算机病毒、黑客攻击等因素，及其他合法范围内的不能预见、不能避免并不能克服的客观情况。
        </p>
      </li>
      <li>
        <p>2、服务中止、中断及终止</p>
        <p>
          本商城根据自身商业决策等原因可能会选择中止、中断及终止服务。如有此等情形发生，本商城会采取公告的形式通知用户。经国家行政或司法机关的生效法律文书确认用户存在违法或侵权行为，或者本商城根据自身的判断，认为用户的行为涉嫌违反本协议的协议或涉嫌违反法律法规的规定的，则本商城有权中止、中断或终止向用户提供服务，且无须为此向用户或任何第三方承担责任。
        </p>
      </li>
      <li>
        <p>3、所有权及知识产权</p>
        <ul>
          <li>
            <p>
              （1）本商城上所有内容，包括但不限于文字、软件、声音、图片、录像、图表、网站架构、网站画面的安排、网页设计、在广告中的全部内容、商品以及其它信息均由本商城或其他权利人依法拥有其知识产权，包括但不限于商标权、专利权、著作权、商业秘密等。非经本商城或其他权利人书面同意，用户不得擅自使用、修改、全部或部分复制、公开传播、改变、散布、发行或公开发表、转载、引用、链接、抓取或以其他方式使用本平台程序或内容。如有违反，用户同意承担由此给本商城或其他权利人造成的一切损失。
            </p>
          </li>
          <li>
            <p>
              （2）本商城尊重知识产权并注重保护用户享有的各项权利。在本商城上，用户可能需要通过发表评论等各种方式向本商城提供内容。在此情况下，用户仍然享有此等内容的完整知识产权，但承诺不将已发表于本平台的信息，以任何形式发布或授权其他主体以任何方式使用。用户在提供内容时将授予本商城一项全球性的免费许可，允许本商城及其关联公司使用、传播、复制、修改、再许可、翻译、创建衍生作品、出版、表演及展示此等内容。
            </p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          4、本商城保留删除平台上各类不符合法律政策或不真实的信息内容而无须通知用户的权利。
        </p>
      </li>
      <li>
        <p>
          5、本协议适用中华人民共和国大陆地区施行的法律。当本协议的任何内容与中华人民共和国法律相抵触时，应当以法律规定为准，同时相关协议将按法律规定进行修改或重新解释，而本协议其他部分的法律效力不变。
        </p>
      </li>
      <li>
        <p>
          6、本商城不行使、未能及时行使或者未充分行使本协议或者按照法律规定所享有的权利，不应被视为放弃该权利，也不影响本商城在将来行使该权利。
        </p>
      </li>
      <li>
        <p>7、如果用户对本协议内容有任何疑问，请联系客户服务中心。</p>
      </li>
    </ul>
  </div>
)

const 隐私政策 = (
  <div>
    <h2>隐私政策</h2>
    <p>
      <b>
        闪送商城
        （以下或称“我们”）注重保护用户个人信息及个人隐私。本隐私政策解释了用户（“您”）个人信息收集（以下或称“信息”）和使用的有关情况，本隐私政策适用于闪送商城向您提供的所有相关服务（以下称“商城服务”或“服务”）。如果您不同意本隐私政策的任何内容，您应立即停止使用商城服务。当您使用我们提供的任一服务时，即表示您已同意我们按照本隐私政策来合法使用和保护您的个人信息。
      </b>
    </p>

    <h3>一、个人信息的收集</h3>
    <p>
      我们收集信息是为了向您提供更好以及更个性化的服务，并努力提高您的用户体验。我们收集信息的种类如下：
    </p>
    <ul>
      <li>
        <p>1、您向我们提供的信息</p>
        <p>
          当您注册账户及您在使用相关服务时填写、提交及/或其他任何方式提供的信息，包括您的姓名、性别、出生年月日、身份证号码、护照姓、护照名、护照号码、电话号码、电子邮箱、收货地址、银行卡信息及相关附加信息（如您地址中的所在的省份和城市、邮政编码等）。您可以选择不提供某一或某些信息，但是这样可能使您无法使用许多特色服务。请您理解，我们使用您提供的信息是为了回应您的要求，为您在购物或享受服务提供便利，完善商城以及与您进行信息沟通。另外，我们可能会将您所提供的信息与您的账户关联，用以识别您的身份。
        </p>
      </li>
      <li>
        <p>2、我们在您使用服务过程中获得的信息</p>
        <p>
          为了提高服务质量和用户体验，我们会留存您使用服务以及使用方式的相关信息，这类信息包括：
        </p>
        <ul>
          <li>
            <p>
              （1）您的浏览器和计算机上的信息。在您访问网站或使用商城服务时，系统自动接收并记录的您的浏览器和计算机上的信息（包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据）。
            </p>
          </li>
          <li>
            <p>
              （2）您的位置信息。当您下载或使用我们、其关联方及合作伙伴开发的应用程序，或访问移动网页使用商城服务时，我们可能会读取您的位置（大多数移动设备将允许您关闭定位服务，具体建议您联系您的移动设备的服务商或生产商）。
            </p>
          </li>
          <li>
            <p>
              （3）您的设备信息。我们可能会读取您访问商城服务时所使用的终端设备的信息，包括但不限于设备型号、设备识别码、操作系统、分辨率、电信运营商等。
            </p>
          </li>
          <li>
            <p>
              （4）您的行为或交易信息。我们可能会记录您访问使用商城服务时所进行的操作以及您在网站上进行交易的相关信息。
            </p>
          </li>
        </ul>
        <p>
          除上述信息外，我们还可能为了提供服务及改进服务质量的合理需要而获得的您的其他信息，包括您与我们的客服团队联系时您提供的相关信息，您参与问卷调查时向我们发送的问卷答复信息，以及您与我们的关联方、合作伙伴之间互动时我们获得的相关信息。
        </p>
        <p>
          同时，为提高您使用我们提供的服务的安全性，更准确地预防钓鱼网站欺诈和木马病毒，我们可能会通过了解一些您的网络使用习惯、您常用的软件信息等手段来判断您账户的风险，并可能会记录一些我们认为有风险的链接（“URL”）。
        </p>
      </li>
    </ul>
    <h3>二、对个人信息的管理和使用</h3>
    <p>
      为向您提供服务、提升我们的服务质量以及优化您的服务体验，我们会在符合法律规定下使用您的个人信息，并主要用于下列用途：
    </p>
    <ul>
      <li>
        <p>1、向您提供您使用的各项服务，并维护、改进这些服务。</p>
      </li>
      <li>
        <p>
          2、向您推荐您可能感兴趣的内容，包括但不限于向您发出产品和服务信息，或通过系统向您展示个性化的第三方推广信息，或在征得您同意的情况下与我们的合作伙伴共享信息以便他们向您发送有关其产品和服务的信息。如您不希望接收上述信息，可通过相应的退订功能进行退订。
        </p>
      </li>
      <li>
        <p>
          3、我们可能使用您的个人信息以验证身份、预防、发现、调查欺诈、危害安全、非法或违反与我们或其关联方协议、政策或规则的行为，以保护您、其他用户，或其关联方的合法权益。
        </p>
      </li>
      <li>
        <p>
          4、我们可能会将来自某项服务的个人信息与来自其他服务所获得的信息结合起来，用于为了给您提供更加个性化的服务使用，例如为让您通过购物拥有更广泛的社交圈而使用、共享或披露您的少量信息。
        </p>
      </li>
      <li>
        <p>
          5、我们会对我们的服务使用情况进行统计，并可能会与公众或第三方分享这些统计信息，以展示我们的产品或服务的整体使用趋势。但这些统计信息不包含您的任何身份识别信息。
        </p>
      </li>
      <li>
        <p>6、让您参与有关我们产品及服务的调查。</p>
      </li>
      <li>
        <p>7、经您同意或授权的其他用途。</p>
      </li>
    </ul>

    <h3>三、个人信息的分享</h3>
    <p>
      您的个人信息是我们为您提供服务的重要部分，我们会遵循法律规定对您的信息承担保密义务。除以下情形外，我们不会将您的个人信息披露给第三方：
    </p>
    <ul>
      <li>
        <p>1、征得您的同意或授权。</p>
      </li>
      <li>
        <p>2、根据法律法规的规定或行政或司法机构的要求。</p>
      </li>
      <li>
        <p>
          3、出于实现“对您个人信息的管理和使用”部分所述目的，或为履行我们在《用户注册协议》或本隐私政策中的义务和行使我们的权利，向关联方、合作伙伴或代表我们履行某项职能的第三方（例如代表我们发出推送通知的通讯服务商、处理银行卡的支付机构等）分享您的个人信息。
        </p>
      </li>
      <li>
        <p>
          4、如您是适格的知识产权投诉人并已提起投诉，应被投诉人要求，向被投诉人披露，以便双
          方处理可能产生的权利纠纷。
        </p>
      </li>
      <li>
        <p>
          5、只有共享您的信息，才能提供您需要的服务，或处理您与他人的纠纷或争议。
        </p>
      </li>
      <li>
        <p>
          6、您出现违反中国有关法律、法规规定或者违反您与我们签署的相关协议（包括在线签署的电子协议）或违反相关我们平台规则时需要向第三方披露的情形。
        </p>
      </li>
    </ul>

    <p>
      随着业务的发展，我们和关联方有可能进行合并、收购、资产转让或类似的交易，您的个人信息有可能作为此类交易的一部分而被转移。我们将在转移前通知您。
    </p>

    <h3>四、个人信息的安全</h3>
    <p>
      我们严格保护您的个人信息安全。我们使用各种制度、安全技术和程序等措施来保护您的个人信息不被未经授权的访问、篡改、披露或破坏。如果您对我们的个人信息保护有任何疑问，请联系我们的客服。
    </p>
    <p>
      在通过我们网站与第三方进行网上商品或服务的交易时，您不可避免的要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或者邮政地址等。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息泄密，尤其是你的账户及密码发生泄露，请您立即联络我们的客服，以便我们采取相应措施。
    </p>

    <h3>五、未成年人的个人信息保护</h3>
    <p>
      我们非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，在使用我们服务前，应事先取得您家长或法定监护人的书面同意。我们根据国家相关法律法规的规定保护未成年人的个人信息。
    </p>

    <h3>六、通知和修订</h3>
    <p>
      为给你提供更好的服务，我们的业务将不时变化，本隐私政策也将随之调整。我们会通过在我们网站、移动端上发出更新版本并提醒您相关内容的更新，也请您访问本页面以便及时了解最新的隐私政策。如果您对于本隐私政策或在使用服务时对于您的个人信息或隐私情况有任何问题，请联系我们客服并作充分描述，我们将尽力解决。
    </p>
  </div>
)

const 商务合作 = (
  <div>
    <h2>商务合作</h2>
    <h3>商务及广告合作</h3>
    <p>如果您希望投放广告或相关商务合作，</p>
    <p>请通过以下方式联系我们</p>

    <p><a href="tel:01086395212">电话：010-86395212</a></p>
    <p><a href="mailto:bd@ecnova.com">邮箱：bd@ecnova.com</a></p>

    <h3>供应及产品合作</h3>
    <p>如果您是</p>

    <ul>
      <li>
        <p>1.国内外知名品牌商，致力于为消费者提供优质可靠的产品；</p>
      </li>
      <li>
        <p>2.匠心独运的精品生产商，打造与众不同的产品体验；</p>
      </li>
      <li>
        <p>3.知名IP的著作权人，期待将其融入至实物产品当中；</p>
      </li>
    </ul>
    <p>请联系我们！</p>

    <p><a href="tel:4006-404-505">电话：4006-404-505</a></p>
    <p><a href="mailto:bd@ecnova.com">邮箱：bd@ecnova.com</a></p>
  </div>
)
