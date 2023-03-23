const axios = require("axios");

/**
 * Obtenemos datos del usuario basado en el numero de telefono
 * @param {*} phone
 * @returns
 */
const getUser = async (phone) => {
  try {
    var config = {
      method: "get",
      url: `https://api-mvm7q.strapidemo.com/api/users?filters[phone][$eq]=${phone}`,
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_KEY}`,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Consultamos el ticket de soporte
 * @param {*} id
 * @returns
 */
const getTicket = async (id) => {
  try {
    var config = {
      method: "get",
      url: `https://api-mvm7q.strapidemo.com/api/tickets?populate[user_id][filters][id][$eq]=${id}`,
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_KEY}`,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = { getUser, getTicket };
