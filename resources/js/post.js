async function createPost() {
    let userInfo = await checkUser();
    let newMessage = document.getElementById("newMessage").value
    if(userInfo) {
        const result = await fetch("/api/create-post", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: userInfo.id, username: userInfo.username, password: userInfo.password, message: newMessage})
        });
        const body = await result.text();
        if(result.ok) {
            document.getElementById("resMessage").innerHTML = "Message posted!";
            document.getElementById("newMessage").value = "";
        }
        else {
            document.getElementById("resMessage").innerHTML = "Message not posted.";
        }
    }
    else {
        window.location = "/login";
    }
}

async function likePost(id) {
    let likesCountDom = document.getElementById(`likes-count-${id}`);
    let likesCount = parseInt(likesCountDom.innerHTML.trim());
    likesCountDom.innerHTML = ++likesCount;
    let userInfo = await checkUser();
    try {
        if(userInfo) {
            const result = await fetch("/api/like-post", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username:userInfo.username, password:userInfo.password, id: id})
            });
            const body = await result.text();
            if(!result.ok) {
                likesCountDom.innerHTML = --likesCount;
            }
        }
        else {
            window.location = "/login";
        }
    } catch(error) {
        likesCountDom.innerHTML = --likesCount;
    }
}