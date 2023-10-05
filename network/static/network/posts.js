document.addEventListener('DOMContentLoaded',() =>{

    document.querySelector('#all-posts').addEventListener('click',() => load_posts('all'));
    if (document.querySelector('#following-posts')){
        document.querySelector('#following-posts').addEventListener('click',() => load_posts('following'));
    }
    document.querySelector('#submit-post').addEventListener('submit',(event) => add_post(event));

    load_posts('all');
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
        })
        .catch(error => {
            console.log(error);
        });
    }


    function load_posts(posts){
        fetch(`/load_posts/${posts}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(post =>show_post(post))
        })
        .catch(error => {
            console.log(error);
        });
    }

    function show_post(post){
        let post_div = document.createElement('div');

        let poster_div = document.createElement('div');
        poster_div.innerHTML = post.poster;

        let content_div = document.createElement('div');
        content_div.innerHTML = post.content;

        let timestamp_div = document.createElement('div');
        timestamp_div.innerHTML = post.timestamp;

        post_div.append(poster_div, content_div, timestamp_div);
        document.querySelector('#posts').append(post_div);


    }

