import { defineStore } from 'pinia'

// Use Pinia as compsotion not options
const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) :null;
if(userData?.workingHoursFrom){
  userData.workingHoursFrom = new Date(userData.workingHoursFrom);
}

if(userData?.workingHoursTo){
  userData.workingHoursTo = new Date(userData.workingHoursTo);
}

export const useAuthStore = defineStore('authStore', {
  state: () => {
    return {
      token: localStorage.getItem('token') || '',
      refresh: localStorage.getItem('refresh') || '',
      userData: userData,
    }
  },
  getters: {
    isLogged: state => !!state.token
  },
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    setRefreshToken(refresh) {
      this.refresh = refresh;
      localStorage.setItem('refresh', refresh);
    },
    setUserData(userData) {
      this.userData = userData;
      localStorage.setItem('userData', JSON.stringify(userData));
    },
    logout() {
      this.token = '';
      this.refresh = '';
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
      localStorage.removeItem('userData');
    },
  },
})