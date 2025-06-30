import type { permissions } from './permissions'

export interface account {
  id: string
  username: string
  email: string
  name: string
  permissions_id: string
  avatar: string
  emailVisibility: boolean
  expand: {
    permissions_id: permissions
  }
}
