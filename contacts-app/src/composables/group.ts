import type { responseData } from '@/interfaces/responseData'
import type { group } from '@/interfaces/group'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useGroup() {
  let groupArray = ref<group[] | null>(null)
  let error = ref('')
  let pageAmount = ref(0)
  async function fetchGroupsData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      pageAmount.value = response.totalPages
      groupArray.value = response.items as group[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }
  function deleteItems(): void {
    groupArray.value = null
  }

  return {
    groupArray,
    pageAmount,
    error,
    fetchGroupsData,
    deleteItems,
  }
}
