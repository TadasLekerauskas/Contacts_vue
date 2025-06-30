import type { responseData } from '@/interfaces/responseData'
import type { companies_offices } from '@/interfaces/companies_offices'
import { getData } from '@/services/services'
import { handleError } from '@/services/handleErrors'
import { ref } from 'vue'

export function useCompaniesOffices() {
  let companies_offices_Array = ref<companies_offices[] | null>(null)
  let error = ref('')
  async function fetchCompaniesOfficesData(url: string): Promise<void> {
    try {
      const response = await getData<responseData>(url)
      companies_offices_Array.value = response.items as companies_offices[]
      error.value = ''
    } catch (err) {
      console.error(err)
      //@ts-ignore
      error.value = handleError(err.code)
    }
  }

  return {
    companies_offices_Array,
    error,
    fetchCompaniesOfficesData,
  }
}
