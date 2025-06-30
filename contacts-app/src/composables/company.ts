import type { responseData } from '@/interfaces/responseData'
import type { company } from '@/interfaces/company'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useCompany() {
  let companyArray = ref<company[] | null>(null)
  let error = ref('')
  let allCompanyCount = ref(0)
  let pageAmount = ref(0)
  async function fetchCompaniesData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      pageAmount.value = response.totalPages
      allCompanyCount.value = response.totalItems
      companyArray.value = response.items as company[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }
  function deleteItems(): void {
    companyArray.value = null
  }

  return {
    companyArray,
    allCompanyCount,
    pageAmount,
    error,
    fetchCompaniesData,
    deleteItems,
  }
}
