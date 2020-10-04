document.addEventListener('DOMContentLoaded', function() {
    console.log("test")
    // load_all_posts()
    load_all_like_buttons()

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

function load_all_like_buttons() {
  let posts = document.querySelectorAll('.post')
  posts.forEach(post => {
    reload_like_button(post)
  })
}

function reload_like_button(post) {
    const post_id = post.querySelector('button[name="like"]').dataset.postId
    const counter = post.querySelector('.like-counter')
    let like_button = post.querySelector('button[name="like"]')
    fetch('/posts/' + post_id + '/like')
      .then(response => response.json())
      .then(like_info => {
        counter.innerHTML = like_info.counter
        if (like_info.liked) {
          like_button.innerHTML = '💔Dislike'
          like_button.onclick = function () {
            dislike_post(post)
          }
        } else {
          like_button.innerHTML = '❤Like'
          like_button.onclick = function () {
            like_post(post)
          }
        }
      });
}

function like_post(post) {
  button = document.querySelector('#follow')
  const post_id = post.querySelector('button[name="like"]').dataset.postId
  let csrftoken = getCookie('csrftoken');
  // button.innerHTML = 'unfollow'
  fetch('/posts/'+post_id+'/like', {
    method: 'POST',
    headers: { "X-CSRFToken": csrftoken }
  })
  .then(response => {
      console.log(response)
  })
  .then(result => {
      // load_likes_buttons()
      load_all_like_buttons()
  })
  // Catch any errors and log them to the console
  .catch(error => {
      console.log('Error:', error);
  });
  // Prevent default submission
  return false;
}

function dislike_post(post) {
  button = document.querySelector('#follow')
  const post_id = post.querySelector('button[name="like"]').dataset.postId
  let csrftoken = getCookie('csrftoken');
  // button.innerHTML = 'unfollow'
  fetch('/posts/'+post_id+'/dislike', {
    method: 'POST',
    headers: { "X-CSRFToken": csrftoken }
  })
  .then(response => {
      console.log("response")
  })
  .then(result => {
    // load_likes_buttons()
    load_all_like_buttons()
  })
  // Catch any errors and log them to the console
  .catch(error => {
      console.log('Error:', error);
  });
  // Prevent default submission
  return false;
}

function load_all_posts() {
  container = document.querySelector('#posts-container')
  let posts = document.querySelectorAll('.post')
      posts.forEach(post => {
        console.log(post)
        const like_button = post.querySelector('button[name="like"]')
        console.log(like_button)
        like_button.addEventListener('click', () =>{
          like_post(post)
        })
      });
}
