// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "127.0.0.1",// this will work
  user: "C4131F23U154",
  database: "C4131F23U154",
  password: "23766", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.

async function getMessages(){
  try {
    let retval =  await connPool.awaitQuery(`
    SELECT * FROM messages
    ORDER BY id DESC;
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

async function getPostsByUser(id) {
  try {
    let retval = await connPool.awaitQuery(`
    SELECT * FROM messages where poster="${id}";
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


module.exports = {getMessages, getUserById, login, getPostsByUser, deletePost, createPost, updatePost}