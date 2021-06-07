const { createConnection } = require("mongoose");

// Creates multiple connections and return them
exports.createConnections = async (url1, url2, options) => {
  try {
    const db1 = await createConnection(url1, options);
    const db2 = await createConnection(url2, options);
    return {
      db1,
      db2,
    };
  } catch (error) {
    console.log(error);
  }
};
