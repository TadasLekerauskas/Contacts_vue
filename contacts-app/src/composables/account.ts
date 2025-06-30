import type { responseData } from '@/interfaces/responseData'
import type { account } from '@/interfaces/account'
import { getAdminData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useAccount() {
  let accountArray = ref<account[] | null>(null)
  let error = ref('')
  let pageAmount = ref(0)
  async function fetchAccountsData(url: string, token: string): Promise<void> {
    try {
      const response = await getAdminData<responseData>(url, token)
      pageAmount.value = response.totalPages
      accountArray.value = response.items as account[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }
  function deleteItems(): void {
    accountArray.value = null
  }

  return {
    accountArray,
    pageAmount,
    error,
    fetchAccountsData,
    deleteItems,
  }
}
