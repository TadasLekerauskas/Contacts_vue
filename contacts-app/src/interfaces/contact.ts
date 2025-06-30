import type { company } from './company'
import type { department } from './department'
import type { division } from './division'
import type { group } from './group'
import type { office } from './office'

export interface contact {
  id?: string
  name: string
  surname: string
  email: string
  phone_number?: string
  position: string
  created: string
  updated: string
  company_id: string
  office_id: string
  division_id: string
  department_id?: string
  group_id?: string
  photo?: string | File
  expand?: {
    office_id?: office
    company_id?: company
    department_id?: department
    division_id?: division
    group_id?: group
  }
}
