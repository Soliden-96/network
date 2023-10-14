import { load_posts, show_post } from './posts.js';

document.addEventListener('DOMContentLoaded',() => {
    let userid = parseInt(document.querySelector('#posts').dataset.user_id,10);
    console.log(userid);
    load_posts(userid);
});