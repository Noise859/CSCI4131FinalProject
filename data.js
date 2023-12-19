const mysql = require(`mysql-await`);

var connPool = mysql.createPool({
  connectionLimit: 5, 
  host: "127.0.0.1",
  user: "C4131F23U154",
  database: "C4131F23U154",
  password: "23766", 
});



async function getAllMessages(){
  try {
    let retval =  await connPool.awaitQuery(`
    SELECT * FROM messages;
    `);
    return retval;
  } catch(error) {
    console.log(error);
    return false;
  }
}

async function getMessages(pageNum, pageLimit, orderBy){
  try {
    let offset = (pageNum - 1) * pageLimit;
    let retval =  await connPool.awaitQuery(`
    SELECT * FROM messages
    ORDER BY ${orderBy} DESC
    LIMIT ${pageLimit} OFFSET ${offset};
    `);
    for(message of retval) {
      user = await getUserById(message.poster);
      for(nUser of user) {
        message.username = nUser.username;
      }
    }
    return retval;
  } catch(error) {
    console.log(error);
    return false;
  }
}


async function getUserById(id) {
  try {
    let retval = await connPool.awaitQuery(`
    SELECT username FROM accounts WHERE id=${parseInt(id)};
    `);
    return retval;
  } catch(error) {
    console.log(error);
    return false;
  }
}

async function login(username, password){
  try {
    let retval = await connPool.awaitQuery(`
    SELECT * FROM accounts where username="${username}";
    `);
    for(user of retval) {
      if(user.password == password) {
        return user;
      }
    }
    return false;
  } catch(error) {
    console.log(error);
    return false;
  }
}

async function createAccount(username, password) {
  try {
    let retval = await connPool.awaitQuery(`
    INSERT INTO accounts (username, password)
    VALUES ("${username}", "${password}");
    `);
    return retval;
  } catch(error) {
    console.log(error);
    return false;
  }
}

async function getAllPostsByUser(id) {
  try {
    let retval = await connPool.awaitQuery(`
    SELECT * FROM messages 
    WHERE poster="${id}"
    ORDER BY id DESC;
    `);
    return retval
  } catch(error) {
    console.log(error);
    return false;
  }
}

async function getPostsByUser(id, pageNum, pageLimit, orderBy) {
  try {
    let offset = (pageNum - 1) * pageLimit;
    let retval =  await connPool.awaitQuery(`
    SELECT * FROM messages 
    WHERE poster="${id}"
    ORDER BY ${orderBy} DESC
    LIMIT ${pageLimit} OFFSET ${offset};
    `);
    return retval
  } catch(error) {
    console.log(error);
    return false;
  }
}

async function deletePost(id) {
  try {
    let retval = await connPool.awaitQuery(`
    DELETE FROM messages
    WHERE id = ${id};
    `);
    return retval
  } catch(error) {
    console.log(error);
    return false;
  }
}

async function updatePost(id, message) {
  try {
    let retval = await connPool.awaitQuery(`
    UPDATE messages
    SET message="${message}"
    WHERE id = ${id};
    `);
    return retval
  } catch(error) {
    console.log(error);
    return false;
  }
}


async function createPost(id, message) {
  try {
    let retval = await connPool.awaitQuery(`
    INSERT INTO messages (message, poster)
    VALUES ("${message}", ${id});
    `);
    return retval
  } catch(error) {
    console.log(error);
    return false;
  }
}

async function likePost(id) {
  try {
    let retval = await connPool.awaitQuery(`
    SELECT * FROM messages WHERE id=${id};
    `);
    if(retval.length > 0) {
      try {
        let likesCount = retval[0].likes;
        likesCount++;
        retval = await connPool.awaitQuery(`
        UPDATE messages
        SET likes="${likesCount}"
        WHERE id = ${id};
        `);
        return retval;
      } catch(error) {
        console.log(error);
        return false;
      }
    }
    else {
      return false;
    }
  } catch(error) {
    console.log(error);
    return false;
  }
}


module.exports = {getAllPostsByUser, getAllMessages, getMessages, getUserById, login, getPostsByUser, deletePost, createPost, updatePost, createAccount, likePost}