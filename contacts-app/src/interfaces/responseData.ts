import type { account } from './account'
import type { companies_offices } from './companies_offices'
import type { company } from './company'
import type { contact } from './contact'
import type { department } from './department'
import type { departments_groups } from './departments_groups'
import type { division } from './division'
import type { divisions_departments } from './divisions_departments'
import type { group } from './group'
import type { office } from './office'
import type { offices_divisions } from './offices_divisions'
export interface responseData {
  items:
    | contact[]
    | contact
    | office[]
    | office
    | company[]
    | company
    | department[]
    | department
    | division[]
    | division
    | group[]
    | group
    | companies_offices[]
    | offices_divisions[]
    | divisions_departments[]
    | departments_groups[]
    | account[]
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}
