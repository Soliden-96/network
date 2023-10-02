document.addEventListener('DOMContentLoaded',() =>{

    document.querySelector('#all-posts').addEventListener('click',() => load_posts('all'));
    document.querySelector('#following-posts').addEventListener('click',() => load_posts('following'));
    document.querySelector('#submit-post').addEventListener('submit',(event) => add_post);

    load_posts('all');
});


    function add_post(event){
        event.preventDefault();
        let content = document.querySelector('#new-post-text').value;
        
        fetch("/add_post",{
            method:'POST',
            body: JSON.stringify({
                content:content
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
            data.forEach(post => show_post(post));
        });
    }

    function show_post(post){
        let post_div = document.createElement('div');

        let poster_div = document.createElement('div');
        poster_div.innerHTML = post["poster"];

        let content_div = document.createElement('div');
        content_div.innerHTML = post["content"];

        let timestamp_div = document.createElement('div');
        timestamp_div.innerHTML = post["timestamp"];

        post_div.append(poster_div, content_div, timestamp_div);
        document.querySelector('#posts').append(post_div);


    }

