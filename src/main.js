import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'; // The theme package you installed
import 'sweetalert2/dist/sweetalert2.min.css' // Sweet alert Style
import 'primeicons/primeicons.css' // Prime Icons Style
import "./main.css"


import KeyFilter from 'primevue/keyfilter';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';

const app = createApp(App)

app.use(ToastService)
app.component('Toast', Toast); 
app.directive('keyfilter', KeyFilter);
app.use(createPinia())
app.use(router)

// PrimeVue
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: 'none',
            // This ensures PrimeVue styles don't fight with Tailwind
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue, utilities'
            }
        }
    }
});

app.mount('#app')
