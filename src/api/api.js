const API_VERSION="V1";

const endPoints ={
    auth:{
        register:`/${API_VERSION}/auth/register`,
        login:`/${API_VERSION}/auth/login`,
        logout:`/${API_VERSION}/auth/logout`,
    },
    users: {
    list: `/${API_VERSION}/users`,
    getById: `/${API_VERSION}/users/:id`,
  },
};

module.exports ={
    endPoints,
    API_VERSION
};