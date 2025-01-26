import axios from 'axios';
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Set up Axios
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set up Pusher and Laravel Echo
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY, // Use import.meta.env instead of process.env
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER, // Use import.meta.env instead of process.env
    forceTLS: true,
});