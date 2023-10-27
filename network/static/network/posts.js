document.addEventListener('DOMContentLoaded',() =>{

    if (document.querySelector('#submit-post')){
        document.querySelector('#submit-post').addEventListener('submit',(event) => add_post(event));
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
        content_div.innerHTML = post.content;

        let timestamp_div = document.createElement('div');
        timestamp_div.innerHTML = post.timestamp;

        post_div.append(poster_link, content_div, timestamp_div);
        document.querySelector(`#${activeDiv}`).prepend(post_div);
    }



