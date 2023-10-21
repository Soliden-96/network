import { load_posts, show_post } from './posts.js';

document.addEventListener('DOMContentLoaded',() => {
    console.log('loading...');
    
    if (document.querySelector('#profile-page')){
    
        let userid = parseInt(document.querySelector('#posts').dataset.user_id,10);
        console.log(userid);
        
        load_posts(userid);
        
        const followButton = document.querySelector('#follow');
        
        if (followButton){
            followButton.addEventListener('click', (event) => {
                event.preventDefault();
                console.log("starting event");
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                let followed = followButton.dataset.followed;
                console.log(followed);
                if (followed === "not-followed"){   
                    console.log("Following...");
                    follow(userid,csrfToken,followButton);
                } else if (followed === "followed"){
                    
                    console.log("Unfollowing...")
                    unfollow(userid,csrfToken,followButton);
                }
        });
        }
    }
});

function follow(userid,csrfToken,followButton){
    fetch(`/follow/${userid}`,{
        method:'POST',
        headers:{
            'X-CSRFToken': csrfToken
        },
        body:JSON.stringify({
            follow_id:userid
        })
    })
    .then(response => response.json()) 
    .then(data => {
        console.log(data.message);
        followButton.dataset.followed = "followed";
        followButton.innerHTML = "Unfollow";
        let count = parseInt(document.querySelector('#followers').innerHTML,10);
        console.log(count);
        count++;
        document.querySelector('#followers').innerHTML = count;
    })
    .catch(error => {
        console.log(error);
    });
}

function unfollow(userid,csrfToken,followButton){
    fetch(`/unfollow/${userid}`,{
        method:'DELETE',
        headers:{
            'X-CSRFToken': csrfToken
        },
        body:JSON.stringify({
            follow_id:userid
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        followButton.dataset.followed = "not-followed";
        followButton.innerHTML = "Follow";
        let count = parseInt(document.querySelector('#followers').innerHTML,10);
        console.log(count);
        count--;
        document.querySelector('#followers').innerHTML = count;
    })
    .catch(error => {
        console.log(error);
    });
}

