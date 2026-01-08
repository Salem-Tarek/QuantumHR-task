import { useToast } from 'primevue/usetoast'

export function useAppToast() {
  const toast = useToast()

  // Types => success, error, info, warn
  const showToast = (toastData = { message: '', title: 'Success', type: 'success', time: 3000, noTime: false }) => {
    // message, title = 'Success', type = 'success', time= 3000
    let handledToastData = {
      severity: toastData.type || 'success',
      summary: toastData.title || 'Success!',
      detail: toastData.message,
    }
    
    if(!toastData.noTime){
      handledToastData.life = toastData.time || 3000;
    }

    toast.add({
      ...handledToastData
    })
  }

  return { showToast }
}
