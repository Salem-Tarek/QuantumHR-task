import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchUsers } from './services'
import { useAppToast } from '@/composables/useAppToast'

export const useUserStore = defineStore('userStore', () => {

  // state
  const users = ref([])
  const allUsers = ref([])
  const isLoading = ref(false)
  const isFiltered = ref(false)

  // toast
  const { showToast } = useAppToast()

  // actions
  const fetchUsersData = async () => {
    isLoading.value = true

    try {
      const res = await fetchUsers()

      if (res.status === 200) {
        users.value = res?.data?.results || []
        allUsers.value = users.value;
        showToast({message: 'Data Fetched Successfully', title: 'Success!', time: 3000 })
      }
    } catch (err) {
      showToast({message: (err?.message || 'Error in Fetching Data'), title: 'Error!', type: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  const filterUsersData = async (filters = null) => {
    isLoading.value = true
    setTimeout(() => {
      try {
        if (filters?.searchText) {
          const search = filters?.searchText?.toLowerCase() || '';
          users.value = allUsers.value.filter(
            (user) =>
              user.name.first.toLowerCase().includes(search) ||
              user.name.last.toLowerCase().includes(search)
          )
          isFiltered.value = true;
        } else {
          users.value = allUsers.value;
          isFiltered.value = false;
        }
        showToast({ message: 'Data Filtered Successfully', title: 'Success!', time: 3000 })
      } catch (err) {
        console.log("err")
        console.log(err)
        showToast({ message: (err?.message || 'Error in Filtering Data'), title: 'Error!', type: 'error' })
      }
      isLoading.value = false
    }, 1000)
  }



  return {
    users,
    allUsers,
    isLoading,
    isFiltered,
    fetchUsersData,
    filterUsersData,
  }
})
