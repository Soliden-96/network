document.addEventListener('DOMContentLoaded',() =>{

    document.querySelector('#all-posts').addEventListener('click',() => load_posts('all'));
    document.querySelector('#following-posts').addEventListener('click',() => load_posts('following'));
    document.querySelector('#submit-post').addEventListener('submit',(event) => add_post);

    load_posts('all');

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

})