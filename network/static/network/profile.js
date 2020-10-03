document.addEventListener('DOMContentLoaded', function() {
    console.log("test")
    load_profile_posts()
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
  // Send a POST request to the URL
  const post_id = post.querySelector('button[name="edit"]').dataset.postId
  const textarea = post.querySelector('textarea');
  const new_body = textarea.value
  let csrftoken = getCookie('csrftoken');
  fetch('/posts/' + post_id, {
    method: 'PUT',
    body: JSON.stringify({
      body: new_body,
    }),
    headers: { "X-CSRFToken": csrftoken },
    credentials: "include"
  })
    .then(response => {
      response.json()
      console.log(response)
      // console.log(response.json())      
      // location.reload()
    })
    // Catch any errors and log them to the console
    .catch(error => {
      console.log('Error:', error);
    });
  // Prevent default submission
  return false;
}

function load_editpost(post){
  const post_body = post.querySelector('.post-body');
  const post_foot = post.querySelector('.post-foot');
  prev_body = post_body.innerHTML
  post_body.innerHTML = ""
  const edit_elem = document.createElement('textarea')
  edit_elem.value = prev_body
  edit_elem.className = "form-control"
  edit_elem.cols = 80
  edit_elem.rows = 3
  const save_button = document.createElement('button')
  save_button.innerText = "Save"
  save_button.className = "btn btn-success"
  post.append(edit_elem)
  post.append(save_button)
  save_button.addEventListener('click', () => {
    let childrens = post.children
    for (const child in childrens) {
      if (childrens.hasOwnProperty(child)) {
        const element = childrens[child];
        element.style.display = 'initial'
      }
    }
    save_button.style.display = "none"
    edit_elem.style.display = "none"
    post.style.border = "black 1px solid"
    post_body.style.display = "block"
    post_foot.style.display = "block"
    post_body.innerHTML = edit_elem.value
    edit_post(post)
  })
  
} 

function like_post(post){

}

function load_profile_posts() {
  container = document.querySelector('#posts-container')
  let posts = document.querySelectorAll('.post')
  posts.forEach(post => {
    console.log(post)
    const edit_button = post.querySelector('button[name="edit"]')
    const like_button = post.querySelector('button[name="like"]')
    
    if (edit_button) {
      console.log(edit_button)
      edit_button.addEventListener('click', () => {
        let childrens = post.children
        for (const child in childrens) {
          if (childrens.hasOwnProperty(child)) {
            const element = childrens[child];
            element.style.display = 'none'
          }
        }
        // edit_button.style.visibility = 'hidden'
        post.style.border = "white"
        load_editpost(post)
      })
    }
    console.log(like_button)
    like_button.addEventListener('click', () => {
      like_post(post)
    })
    // edit_button.innerHTML = 'Edit post'
    // // TODO: like changes when liked, like function
    // like_button.innerHTML = '❤Like'
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
