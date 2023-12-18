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
        }
        else {
            document.getElementById("resMessage").innerHTML = "Message not posted.";
        }
    }
    else {
        window.location = "/login";
    }
}