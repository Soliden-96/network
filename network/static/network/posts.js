document.addEventListener('DOMContentLoaded',() =>{

    
    if (document.querySelector('#following-page')){
        
        document.querySelector('#following-page').addEventListener('click',() => {
            document.querySelector('#main-page').style.display = 'None';
            load_posts('following');
        })
    }
    if (document.querySelector('#submit-post')){
        document.querySelector('#submit-post').addEventListener('submit',(event) => add_post(event));
    }
    if (document.querySelector('#main-page')){
        load_posts('all');
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
            if (document.querySelector('#all-posts')){
                let activeDiv = 'all-posts';
                show_post(result.post,activeDiv); 
            }   
        })
        .catch(error => {
            console.log(error);
        });
        
       
    }


    function load_posts(posts){
        let activeDiv = posts;
        if (activeDiv === 'all'){
            activeDiv = 'all-posts';
        } else if (activeDiv === 'following'){
            activeDiv = 'following-posts';
        } else {
            activeDiv = 'profile-posts';
        } 
        document.querySelector(`#${activeDiv}`).innerHTML = "";

        fetch(`/load_posts/${posts}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(post => show_post(post,activeDiv))
        })
        .catch(error => {
            console.log(error);
        });
    }


    function show_post(post,activeDiv){
        let post_div = document.createElement('div');
        post_div.className = 'post';

        let poster_div = document.createElement('div');
        poster_div.innerHTML = post.poster;

        let content_div = document.createElement('div');
        content_div.innerHTML = post.content;

        let timestamp_div = document.createElement('div');
        timestamp_div.innerHTML = post.timestamp;

        post_div.append(poster_div, content_div, timestamp_div);
        document.querySelector(`#${activeDiv}`).prepend(post_div);
    }

export { load_posts, show_post };

