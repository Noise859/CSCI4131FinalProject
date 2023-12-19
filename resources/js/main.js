async function checkUser(){
    try {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const result = await fetch("/api/checkuser", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: userInfo.username, password: userInfo.password})
        });
        if(!result.ok){
            return false;
        }
        else {
            return userInfo;
        }
    } catch(error) {
        return false;
    }
}

function logout() {
    localStorage.removeItem("userInfo");
    window.location = "/main";
}