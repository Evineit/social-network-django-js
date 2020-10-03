document.addEventListener('DOMContentLoaded', function() {
    console.log("test")
    load_all_posts()
    if (document.querySelector('form')){
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
  container = document.querySelector('#posts-container')
  let posts = document.querySelectorAll('.post')
      posts.forEach(post => {
        console.log(post)
        const edit_button = post.querySelector('button[name="edit"]')
        const like_button = post.querySelector('button[name="like"]')
        edit_button.addEventListener('click', () => {
          edit_post(post)
        })
        like_button.addEventListener('click', () =>{
          like_post(post)
        })
        // edit_button.innerHTML = 'Edit post'
        // // TODO: like changes when liked, like function
        // like_button.innerHTML = '❤Like'
      });
}
