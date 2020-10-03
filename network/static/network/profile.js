document.addEventListener('DOMContentLoaded', function() {
    console.log("test")
    // load_profile_posts()
    load_follow_button()
    
    const form = document.querySelector('form');
    if (!form) return false;
    form.onsubmit = function() {
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
          load_profile_posts()
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

function load_profile_posts() {
    container = document.querySelector('#posts-container')
    username = document.querySelector('h1').innerHTML
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    fetch(`/posts/${username}`)
    .then(response => response.json())
    .then(posts => {
      // Print emails
      // console.log(emails);
      
      posts.forEach(post => {
        const element = document.createElement('div');
        element.style.border = "black 1px solid"
        element.style.padding = "10px"
        const poster_name = document.createElement('a')
        poster_name.href = `/user/${post.user_id}`
        poster_name.className = 'h4'
        poster_name.style = 'display:block; color:black;'
        const edit_button = document.createElement('button');
        const body = document.createElement('div');
        const likes = document.createElement('div');
        const like_button = document.createElement('button')

        edit_button.className= 'btn btn-secondary'
        poster_name.innerHTML = `${post.user}`;
        edit_button.addEventListener('click', (event) => {
          edit_post(post)
        });
        like_button.addEventListener('click', () =>{
            like_post(post)
        });
        edit_button.innerHTML = 'Edit post'
        // TODO: like changes when liked, like function
        like_button.innerHTML = '❤Like'
        body.innerHTML = `
        ${post.body}<hr>
        ${post.timestamp}
        `
        element.append(poster_name)
        likes.append(like_button)
        element.append(edit_button)
        element.append(body)
        element.append(likes)
        document.querySelector('#posts-container').append(element); 
      });

  });
}

function load_follow_button() {
  button = document.querySelector('#follow')
  if (!button) {
    return false
  }
  profile_user = document.querySelector('h1').innerHTML
  if (button.innerHTML == 'follow'){
    button.onclick = function(){
      follow_user(profile_user)
    }
  }else if (button.innerHTML == 'unfollow') {
    button.onclick = function(){
      unfollow_user(profile_user)
    }   
  }
}

function follow_user(username) {
  button = document.querySelector('#follow')
  let csrftoken = getCookie('csrftoken');
  // button.innerHTML = 'unfollow'
  fetch('/user/follow', {
    method: 'POST',
    headers: { "X-CSRFToken": csrftoken },
    body: JSON.stringify({
        username: username
    })
  })
  .then(response => {
      console.log(response)
  })
  .then(result => {
      // Print result
      console.log(result);
      console.log("reload follow button")
      // load_follow_button()
      location.reload()
  })
  // Catch any errors and log them to the console
  .catch(error => {
      console.log('Error:', error);
  });
  // Prevent default submission
  return false;
  
}

    function unfollow_user(username) {
  button = document.querySelector('#follow')
  let csrftoken = getCookie('csrftoken');
  // button.innerHTML = 'follow'

  fetch('/user/unfollow', {
    method: 'POST',
    headers: { "X-CSRFToken": csrftoken },
    body: JSON.stringify({
        username: username
    })
  })
  .then(response => {
      console.log(response)
  })
  .then(result => {
      // Print result
      console.log(result);
      console.log("reload follow button")
      // load_follow_button()
      location.reload()

  })
  // Catch any errors and log them to the console
  .catch(error => {
      console.log('Error:', error);
  });
  // Prevent default submission
  return false;
  
}
