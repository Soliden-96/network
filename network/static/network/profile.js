import { load_posts, show_post } from './posts.js';

document.addEventListener('DOMContentLoaded',() => {
    load_posts('{{ user_profile.id');
});