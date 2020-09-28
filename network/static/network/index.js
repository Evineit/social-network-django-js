document.addEventListener('DOMContentLoaded', function() {
    console.log("test")
    load_all_posts()
    document.querySelector('form').onsubmit = function() {
      const post_body = document.querySelector('#compose-body');
    // Send a POST request to the URL
    let csrftoken = getCookie('csrftoken');
    fetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
            body: post_body.value,
        }),
        headers: { "X-CSRFToken": csrftoken },
        credentials: "include"
      })
      .then(response => {
        response.json()
        console.log(response)
      })
      .then(result => {
          // Print result
          console.log(result);
          post_body.value = ''
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

// The following function is from 
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

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
        element.style.border = "black 1px solid"
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
