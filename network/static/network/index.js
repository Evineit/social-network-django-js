document.addEventListener('DOMContentLoaded', function() {
    console.log("test")
    load_all_posts()
    document.querySelector('form').onsubmit = function() {
    const body = document.querySelector('#compose-body');

    // Send a POST request to the URL
    fetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
            body: body.value
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
          load_all_posts()
      })
      // Catch any errors and log them to the console
      .catch(error => {
          console.log('Error:', error);
      });
      // Prevent default submission
      return false;
    }

});

function edit_post(post){

} 

function like_post(post){

}

function load_all_posts() {
    fetch('/posts/all')
  .then(response => response.json())
  .then(posts => {
      // Print emails
      // console.log(emails);
      
      posts.forEach(post => {
        const element = document.createElement('div');
        const poster_name = document.createElement('h6')
        const edit_button = document.createElement('button');
        const body = document.createElement('div');
        const likes = document.createElement('div');
        const like_button = document.createElement('button')

        edit_button.className= 'btn btn-secondary'
        poster_name.innerHTML = `${post.user}`;
        element.append(poster_name)
        edit_button.addEventListener('click', (event) => {
          edit_post(post)
        });
        like_button.addEventListener('click', () =>{
            like_post(post)
        })
        edit_button.innerHTML = 'Edit post'
        // TODO: like changes when liked, like function
        like_button.innerHTML = '❤Like'
        body.innerHTML = `
        ${post.body}\n
        ${post.timestamp}
        `
        likes.append(like_button)
        element.append(edit_button)
        element.append(body)
        element.append(likes)
        document.querySelector('#posts-container').append(element); 
      });

  });
}
