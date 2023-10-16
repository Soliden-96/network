import { load_posts, show_post } from './posts.js';

document.addEventListener('DOMContentLoaded',() => {
    let userid = parseInt(document.querySelector('#posts').dataset.user_id,10);
    console.log(userid);
    load_posts(userid);
    
    const followButton = document.querySelector('#follow');
    followButton.addEventListener('click', () => {
        if (followButton.dataset.followState === "tofollow"){
            follow(userid);
        } else if (followButton.dataset.followState === "followed"){
            unfollow(userid);
        }
    });
});

function follow(userid){
    fetch(`/follow/${userid}`,{
        method:'POST',
        body:JSON.stringify({
            followed_id:userid
        })
    })
    .then(response => {
        console.log(response);
    });
}

