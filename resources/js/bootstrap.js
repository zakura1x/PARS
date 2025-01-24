import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js'; // Use ES Module import

// Set axios globally
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set Pusher globally
window.Pusher = Pusher;

// Initialize Laravel Echo
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    wsHost: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
    wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
    disableStats: true,
});
