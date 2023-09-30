document.addEventListener('DOMContentLoaded',() =>{

    document.querySelector('#user-profile').addEventListener('click',() => load_profile('user-profile'));
    document.querySelector('#all-posts').addEventListener('click',() => load_posts('all'));
    document.querySelector('#following-posts').addEventListener('click',() => load_posts('following'));

    load_posts('all');
})