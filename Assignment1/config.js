// Create and export configuration variables

var environments = {};

// Staging (default) environment

environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'

};

environments.production = {
    'httpPort': 5000,
    'htpsPort': 5001,
    'envName': 'production'
};

// Determine which environment was passed as a comand-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current enviromeint is one of the enviroments above, or set to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;