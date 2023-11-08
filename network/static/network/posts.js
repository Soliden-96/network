document.addEventListener('DOMContentLoaded',() =>{
    const csrfToken = Cookies.get('csrftoken');
    console.log(csrfToken);
    
    if (document.querySelector('#submit-post')){
        document.querySelector('#submit-post').addEventListener('submit',(event) => add_post(event));
    }

    if (document.querySelectorAll('.edit-button')) {
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (event) => edit(event.target,csrfToken));
        });
    }

    if (document.querySelectorAll('.likeButton')){
        document.querySelectorAll('.likeButton').forEach(button => {
            button.addEventListener('click', (event) => like(event.target,csrfToken));
        })
    }
    
});


    function add_post(event){
        event.preventDefault();
        let content = document.querySelector('#new-post-text').value;
        let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        fetch("/add_post",{
            method:'POST',
            headers:{
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                content: content
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            let posts = document.querySelectorAll('.post');
            if (posts.length === 5){
                posts[posts.length - 1].remove();
            }
            if (document.querySelector('#all-posts')){
                let activeDiv = 'all-posts';
                show_post(result.post,activeDiv); 
            }
            document.querySelector('#new-post-text').value = "";   
        })
        .catch(error => {
            console.log(error);
        });
    }


    function show_post(post,activeDiv){
        let post_div = document.createElement('div');
        post_div.className = 'post';
        
        console.log(post.poster_id);
        let profile_url = `/profile/${post.poster_id}`;
        let poster_link = document.createElement('a');
        poster_link.innerHTML = post.poster;
        poster_link.href = profile_url;

        let content_div = document.createElement('div');
        content_div.id = `${post.id}-content`;
        content_div.innerHTML = post.content;

        let edit_button = document.createElement('button');
        edit_button.dataset.post_id = `${post.id}`;
        edit_button.className = "btn btn-primary edit-button";
        edit_button.innerHTML = "Edit";

        let timestamp_div = document.createElement('div');
        timestamp_div.innerHTML = post.timestamp;

        post_div.append(poster_link, content_div, edit_button, timestamp_div);
        document.querySelector(`#${activeDiv}`).prepend(post_div);
    }

    let isEditing = false;

function edit(button,csrfToken) {
    let postId = button.dataset.post_id;
    console.log(postId);

    let content_div = document.getElementById(`${postId}-content`);
    let textarea = document.getElementById(`${postId}-text`);

    if (!isEditing) {
        textarea.value = content_div.innerHTML;
        content_div.style.display = "none";
        textarea.style.display = "block";
        button.innerHTML = "Done";
        isEditing = true;
    } else {
        let new_content = textarea.value;
        console.log(new_content);

        fetch('/edit', {
            method: 'PUT',
            headers:{
                'X-CSRFToken':csrfToken
            },
            body: JSON.stringify({
                postId: postId,
                new_content: new_content
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            content_div.innerHTML = new_content;
            textarea.style.display = "none";
            content_div.style.display = "block";
            button.innerHTML = 'Edit';
            isEditing = false; 
        })
        .catch(error => {
            console.log(error);
        });
    }
}


function like(button,csrfToken){
    let postId = button.dataset.post_id;

    if (button.dataset.liked === "liked"){
        fetch('/like',{
            method:'DELETE',
            headers:{
                'X-CSRFToken':csrfToken
            },
            body:JSON.stringify({
                postId:postId
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            button.dataset.liked = "not-liked";
            button.innerHTML = "&#9825;";
            let likes = document.getElementById(`${postId}-likes`).innerHTML;
            likes--;
            document.getElementById(`${postId}-likes`).innerHTML = likes;
        })
        .catch(error => {
            console.log(error);
        });
    } else {
        fetch('/like',{
            method:'POST',
            headers:{
                'X-CSRFToken':csrfToken
            },
            body:JSON.stringify({
                postId:postId
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            button.dataset.liked = "liked";
            button.innerHTML = "&#9829;";
            let likes = document.getElementById(`${postId}-likes`).innerHTML;
            likes++;
            document.getElementById(`${postId}-likes`).innerHTML = likes;
        })
        .catch(error => {
            console.log(error);
        })
    }
}
