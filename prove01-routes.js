const fs = require("fs");

const handler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Home Page | Prove01</title></head>");
    res.write("<body>");
    res.write("<h1>Welcome to the Users' Directory</h1>");
    res.write("<h3>Add a new user by filling the form below</h3>");
    res.write(
      '<form action="/create-user" method="POST"><input type="text" name="username" placeholder="Enter username"><button type="submit">Add New User</button></form>'
    );
    res.write("</body>");
    res.write("</html>");
    res.end();
  }

  if (url === "/users") {
    return fs.readFile("users.txt", "utf8", (err, data) => {
      if (err) console.log(err);
      const users = data.split("\n");
      res.write("<html>");
      res.write("<head><title>Home Page | Prove01</title></head>");
      res.write("<body>");
      res.write("<h1>List of users</h1>");
      res.write("<ul>");
      users.forEach((user) => {
        res.write("<li>" + user + "</li>");
      });
      res.write("</ul>");
      res.write("</body>");
      res.write("</html>");
      res.end();
    });
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const newUser = parsedBody.split("=")[1];
      console.log(newUser);
      return fs.appendFile("users.txt", "\n" + newUser, (err) => {
        if (err) console.log(err);
        console.log("Added new user to database!");
        res.statusCode = 302;
        res.setHeader("Location", "/users");
        return res.end();
      });
    });
  }
};

exports.handler = handler;
