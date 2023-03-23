const axios = require("axios");


/**
 * Consultamos inventario
 * @param {*} id
 * @returns
 */
const getItems = async () => {
  try {
    var config = {
      method: "get",
      url: `https://api-mvm7q.strapidemo.com/api/items`,
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_KEY}`,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (e) {
    return null;
  }
};

module.exports = { getItems };
