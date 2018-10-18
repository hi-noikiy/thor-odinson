import { IOrders } from '../../store/orders'
import { UIState } from '../../store/ui'

export interface IOrderListProps {
  ui?: UIState,
  order?: IOrders
}
