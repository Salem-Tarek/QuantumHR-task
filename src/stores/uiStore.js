import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useUIStore = defineStore('uiStore', {
  state: () => {
    return {
      // Add any UI-related state here if needed in the future
      defaultTimer: 3000
    }
  },
  actions: {
    /**
     * Generic success alert
     * @param {String} title - Alert title
     * @param {String} text - Alert message
     * @param {Object} options - Additional SweetAlert2 options
     * @returns {Promise} - Returns a promise that resolves when the alert is closed
     */
    showSuccess(title, text = '', options = {}) {
      return Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonText: options.confirmButtonText || 'OK',
        confirmButtonColor: '#10b981',
        showConfirmButton: options.showConfirmButton !== false,
        timer: options.timer || this.defaultTimer,
        timerProgressBar: options.timer ? true : false,
        ...options
      }).then((result) => {
        if (result.isConfirmed && options.onConfirm) {
          options.onConfirm(result)
        }
        return result
      })
    },

    /**
     * Generic error alert
     * @param {String} title - Alert title
     * @param {String} text - Alert message
     * @param {Object} options - Additional SweetAlert2 options
     * @returns {Promise} - Returns a promise that resolves when the alert is closed
     */
    showError(title, text = '', options = {}) {
      return Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonText: options.confirmButtonText || 'OK',
        confirmButtonColor: '#ef4444',
        showConfirmButton: options.showConfirmButton !== false,
        timer: options.timer || this.defaultTimer,
        timerProgressBar: options.timer ? true : false,
        ...options
      }).then((result) => {
        if (result.isConfirmed && options.onConfirm) {
          options.onConfirm(result)
        }
        return result
      })
    },

    /**
     * Delete confirmation dialog
     * @param {String} title - Confirmation title (default: 'Are you sure?')
     * @param {String} text - Confirmation message (default: 'You won't be able to revert this!')
     * @param {Function} onConfirm - Callback function when user confirms deletion
     * @param {Function} onCancel - Optional callback function when user cancels
     * @param {Object} options - Additional SweetAlert2 options
     * @returns {Promise} - Returns a promise that resolves when the dialog is closed
     */
    showDeleteConfirm(title = 'Are you sure?', text = "You won't be able to revert this!", onConfirm = null, onCancel = null, options = {}) {
      return Swal.fire({
        icon: 'warning',
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonText: options.confirmButtonText || 'Yes, delete it!',
        cancelButtonText: options.cancelButtonText || 'Cancel',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6c757d',
        reverseButtons: options.reverseButtons !== false,
        ...options
      }).then((result) => {
        if (result.isConfirmed && onConfirm) {
          onConfirm(result)
        } else if (result.isDismissed && onCancel) {
          onCancel(result)
        }
        return result
      })
    }
  }
})

