async function getUser(){
    let valid = await checkUser();
    if(valid) {
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        document.getElementById("myProfPic").innerHTML = userInfo.username.charAt(0);
        document.getElementById("myUsername").innerHTML = userInfo.username;
        getMyPosts();
    }
    else {
        window.location = "/login"
    }
}

async function getMyPosts(){
    let pageVars = window.location.search.split(/[?&]/);
    let pageVarsParsed = {}
    for(arg of pageVars) {
        if(arg != "") {
            let splitArg = arg.split(/=/);
            pageVarsParsed[splitArg[0]] = splitArg[1];
        }
    }
    const result = await fetch("/api/getPostsByUser", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: JSON.parse(localStorage.getItem("userInfo")).id, page:parseInt(pageVarsParsed.page), orderBy:pageVarsParsed.orderby})
    });
    const body = await result.json();
    if(result.ok) {
        console.log(body);
        let myPosts = document.getElementById("userPosts");
        let postHTML = `<div class="myAccountPost" id="myAccPagination"><p>Page:</p> `;
        for(var i = 0; i < body.totalPages; i++) {
            let page = i + 1;
            postHTML += `<a class="${page == body.currentPage ? "curPage" : ""}" href="/account?page=${page}&orderby=${body.orderBy}">${page}</a>`;
        }
        postHTML += `</div>`;
        document.getElementById("postCount").innerHTML = "Posts: " + body.allMessageCount;
        for(post of body.posts) {
            postHTML += `
            <div class="myAccountPost" id="post-${post.id}"><!--
                --><p class="myPostMessage" id="post-message-${post.id}">
                    ${post.message}
                </p><!--
                --><button style="border-bottom-left-radius: 10px;" onclick="deletePost(${post.id})"><!--
                    --><i style="border-bottom-left-radius: 10px;" class="fa-regular fa-trash-can"></i><!--
                --></button><!--
                --><button onclick="openPopup(${post.id})"><!--
                    --><i class="fa-regular fa-pen-to-square"></i><!--
                --></button><!--
            --></div>`
        }
        postHTML += `<div class="myAccountPost" id="myAccPagination"><p>Page:</p> `;
        for(var i = 0; i < body.totalPages; i++) {
            let page = i + 1;
            postHTML += `<a class="${page == body.currentPage ? "curPage" : ""}" href="/account?page=${page}&orderby=${body.orderBy}">${page}</a>`;
        }
        postHTML += "</div>"
        myPosts.innerHTML = postHTML;
    }
}

function closePopup(){
    document.getElementById("overlay").style.display = "none";
    document.getElementById("body").style.overflow = "auto";
}

function openPopup(postId){
    document.getElementById("overlay").style.display = "block";
    document.getElementById("body").style.overflow = "hidden";
    popup = document.getElementById("popup")
    .innerHTML = `
    <textarea id="newText" maxlength=420>${document.getElementById("post-message-"+postId).innerHTML.trim()}</textarea>
    <button onclick="updatePost(${postId})">Save</button>
    <button onclick="closePopup()">Cancel</button>
    `;
}

async function deletePost(id) {
    const result = await fetch("/api/delete-post", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id, username: JSON.parse(localStorage.getItem("userInfo")).username, password: JSON.parse(localStorage.getItem("userInfo")).password})
    });
    const body = await result.text();
    if(result.ok) {
        document.getElementById("post-"+id).remove();
        document.getElementById("resMessage").innerHTML = "Post deleted."
    }
    else {
        document.getElementById("resMessage").innerHTML = "Failed to delete post."
    }
}

async function updatePost(id) {
    let message = document.getElementById("newText").value;
    const result = await fetch("/api/update-post", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message:message, id: id, username: JSON.parse(localStorage.getItem("userInfo")).username, password: JSON.parse(localStorage.getItem("userInfo")).password})
    });
    const body = await result.text();
    if(result.ok) {
        closePopup();
        document.getElementById("post-message-"+id).innerHTML = message;
        document.getElementById("resMessage").innerHTML = "Post updated!"
    }
    else {
        document.getElementById("resMessage").innerHTML = "Failed to update post."
    }
}

function stopPropagation(event) {
    event.stopPropagation();
}

