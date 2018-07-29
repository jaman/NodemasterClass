const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
var fs = require('fs');


var httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
    console.log(`The server is listening on port ${config.httpPort}`);
});

const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, () => {
    console.log(`The server is listening on port ${config.httpsPort}`);
});

// All the server logics belon to here
var unifiedServer = function (req, res) {
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object
    let queryStringObject = parsedUrl.query;

    // Get the HTTP method
    let method = req.method.toLocaleLowerCase();

    // Get the headers as an object

    let headers = req.headers;

    // Get the payload, if any
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();
        let payload = buffer;

        // Choose the handler this request should go to.
        // if one is not found, use the notfound handler.

        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        let data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload
        };

        // Route the request to the handler specified in the router
        async function runChosen() {
            var response = await chosenHandler(data);
            var {statusCode, payload} = response;
            payload = typeof(payload) == 'object' ? payload : {};
            let payloadString = JSON.stringify(payload);
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            res.setHeader('content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log(`Returning this response: ${statusCode}`);
        }
        runChosen();

    });
    
}
var handlers = {}

handlers.hello = (data) => {
    return new Promise(resolve => {
        let query  = data.queryStringObject['country'];
        var decoded = decodeURI(`${someGreetings[query]}`);
        console.log(decoded);
        let greetings = typeof(query) !== 'undefined' ? {[query]: decoded} :someGreetings;
        resolve({'statusCode': 200, 'payload': greetings});
    });

};

handlers.ping = (data) => {
    return new Promise(resolve => {
        resolve({'statusCode': 200});
    });
};


handlers.notFound = (data) => {
    return new Promise(resolve => {
        resolve({'statusCode': 404});
    });
};

var router = {
    'ping': handlers.ping,
    'hello': handlers.hello
}



const someGreetings = {
    'Andorra': 'Hola',
    'United Arab Emirates': 'Marhaba',
    'Afghanistan': 'Senga yai',
    'Antigua and Barbuda': 'Hello',
    'Anguilla': 'Hello',
    'Albania': 'Tungjatjeta',
    'Armenia': 'Barev',
    'Netherlands Antilles': 'Kon ta bai',
    'Angola': 'Olá',
    'Asia/Pacific Region': 'Hello',
    'Antarctica': 'Hello',
    'Argentina': 'Hola',
    'American Samoa': 'Hello',
    'Austria': 'Hallo',
    'Australia': 'Hello',
    'Aruba': 'Kon ta bai',
    'Aland Islands': 'Hello',
    'Azerbaijan': 'Salam',
    'Bosnia and Herzegovina': 'Zdravo',
    'Barbados': 'Hello',
    'Bangladesh': 'Namaskar',
    'Belgium': 'Hallo',
    'Burkina Faso': 'Bonjour',
    'Bulgaria': 'Zdravei',
    'Bahrain': 'Marhaba',
    'Burundi': 'Bonjour',
    'Benin': 'Bonjour',
    'Bermuda': 'Hello',
    'Brunei Darussalam': 'Selamat',
    'Bolivia': 'Hola',
    'Brazil': 'Olá',
    'Bahamas': 'Hello',
    'Bhutan': 'Kuzu zangpo',
    'Bouvet Island': 'Hello',
    'Botswana': 'Dumela',
    'Belarus': 'Вітаю',
    'Belize': 'Hello',
    'Canada': 'Hello',
    'Congo  The Democratic Republic of the': 'Bonjour',
    'Central African Republic': 'Bonjour',
    'Congo': 'Bonjour',
    'Switzerland': 'Hallo',
    'Cote d\'Ivoire': 'Bonjour',
    'Cook Islands': 'Kia orana',
    'Chile': 'Hola',
    'Cameroon': 'Hello',
    'China': '&#20320;&#22909;',
    'Colombia': 'Hola',
    'Costa Rica': 'Hola',
    'Cuba': 'Hola',
    'Cape Verde': 'Olá',
    'Cyprus': '&#915;&#949;&#953;&#945; &#963;&#959;&#965;',
    'Czech Republic': 'Dobrý den',
    'Germany': 'Hallo',
    'Djibouti': 'Marhaba',
    'Denmark': 'Hej',
    'Dominica': 'Hello',
    'Dominican Republic': 'Hola',
    'Algeria': 'Marhaba',
    'Ecuador': 'Hola',
    'Estonia': 'Tervist',
    'Egypt': 'Marhaba',
    'Eritrea': 'Marhaba',
    'Spain': 'Hola',
    'Ethiopia': 'Teanastëllën',
    'Europe': 'Hello',
    'Finland': 'Moi',
    'Fiji': 'Hello',
    'Falkland Islands (Malvinas': 'Hello',
    'Micronesia  Federated States of': 'Hello',
    'Faroe Islands': 'Hallo',
    'France': 'Bonjour',
    'Gabon': 'Bonjour',
    'Great Britain': 'Hello',
    'Grenada': 'Hello',
    'Georgia': 'Gamardjobat',
    'French Guiana': 'Bonjour',
    'Guernsey': 'Hello',
    'Ghana': 'Hello',
    'Gibraltar': 'Hello',
    'Greenland': 'Aluu',
    'Gambia': 'Hello',
    'Guinea': 'Bonjour',
    'Guadeloupe': 'Hello',
    'Equatorial Guinea': 'Hola',
    'Greece': '&#915;&#949;&#953;&#945; &#963;&#959;&#965;',
    'Guatemala': 'Hola',
    'Guam': 'Hello',
    'Guinea-Bissau': 'Olá',
    'Guyana': 'Hello',
    'Hong Kong': '&#20320;&#22909;',
    'Honduras': 'HHola',
    'Croatia': 'Bok',
    'Haiti': 'Bonjour',
    'Hungary': 'Jó napot',
    'Indonesia': 'Selamat',
    'Ireland': 'Haileo',
    'Israel': 'Shalom',
    'Isle of Man': 'Hello',
    'India': '&#2344;&#2350;&#2360;&#2381;&#2340;&#2375;',
    'British Indian Ocean Territory': 'Hello',
    'Iraq': 'Marhaba',
    'Iran  Islamic Republic of': 'Salâm',
    'Iceland': 'Góðan daginn',
    'Italy': 'Buon giorno',
    'Jersey': 'Hello',
    'Jamaica': 'Hello',
    'Jordan': 'Marhaba',
    'Japan': '&#12371;&#12435;&#12395;&#12385;&#12399;',
    'Kenya': 'Habari',
    'Kyrgyzstan': 'Kandisiz',
    'Cambodia': 'Sua s\'dei',
    'Kiribati': 'Mauri',
    'Comoros': 'Bariza djioni',
    'Saint Kitts and Nevis': 'Hello',
    'Korea  Democratic People\'s Republic of': '&#50504;&#45397;&#54616;&#49464;&#50836;',
    'Korea  Republic of': '&#50504;&#45397;&#54616;&#49464;&#50836;',
    'Kuwait': 'Marhaba',
    'Cayman Islands': 'Hello',
    'Kazakhstan': 'Salam',
    'Lao People\'s Democratic Republic': 'Sabaidee',
    'Lebanon': 'Marhaba',
    'Saint Lucia': 'Hello',
    'Liechtenstein': 'Hallo',
    'Sri Lanka': 'A`yubowan',
    'Liberia': 'Hello',
    'Lesotho': 'Hello',
    'Lithuania': 'Laba diena',
    'Luxembourg': 'Moïen',
    'Latvia': 'Sveiki',
    'Libyan Arab Jamahiriya': 'Marhaba',
    'Morocco': 'Marhaba',
    'Monaco': 'Bonjour',
    'Moldova  Republic of': 'Salut',
    'Montenegro': 'Zdravo',
    'Madagascar': 'Manao ahoana',
    'Marshall Islands': 'Yokwe',
    'Macedonia': '&#1047;&#1076;&#1088;&#1072;&#1074;&#1086;',
    'Mali': 'Bonjour',
    'Myanmar': 'Mingalarba',
    'Mongolia': 'Sain baina uu',
    'Macao': '&#20320;&#22909;',
    'Northern Mariana Islands': 'Hello',
    'Martinique': 'Hello',
    'Mauritania': 'Marhaba',
    'Montserrat': 'Hello',
    'Malta': 'Bongu',
    'Mauritius': 'Hello',
    'Maldives': 'Kihineth',
    'Malawi': 'Muribwanji',
    'Mexico': 'Hola',
    'Malaysia': 'Selamat',
    'Mozambique': 'Olá',
    'Namibia': 'Hello',
    'New Caledonia': 'Bozo',
    'Niger': 'Bonjour',
    'Norfolk Island': 'Whataway',
    'Nigeria': 'Hello',
    'Nicaragua': 'Hola',
    'Netherlands': 'Hallo',
    'Norway': 'Hallo',
    'Nepal': 'Namaste',
    'Nauru': 'Hello',
    'Niue': 'Faka lofa lahi atu',
    'New Zealand': 'Hello',
    'Oman': 'Marhaba',
    'Panama': 'Hola',
    'Peru': 'Hola',
    'French Polynesia': 'Bonjour',
    'Papua New Guinea': 'Hello',
    'Philippines': 'Halo',
    'Pakistan': 'Adaab',
    'Poland': 'Dzień dobry',
    'Saint Pierre and Miquelon': 'Hello',
    'Puerto Rico': 'Hola',
    'Palestinian Territory': 'Marhaba',
    'Portugal': 'Olá',
    'Palau': 'Alii',
    'Paraguay': 'Hola',
    'Qatar': 'Marhaba',
    'Reunion': 'Hello',
    'Romania': 'Salut',
    'Serbia': 'Zdravo',
    'Russian Federation': '&#1047;&#1076;&#1088;&#1072;&#1074;&#1089;&#1090;&#1074;&#1091;&#1081;&#1090;&#1077;',
    'Rwanda': 'Hello',
    'Saudi Arabia': 'Marhaba',
    'Solomon Islands': 'Hello',
    'Seychelles': 'Hello',
    'Sudan': 'Marhaba',
    'Sweden': 'God dag',
    'Singapore': 'Selamat',
    'Slovenia': 'Živijo',
    'Slovakia': 'Dobrý deň',
    'Sierra Leone': 'Hello',
    'San Marino': 'Buon giorno',
    'Senegal': 'Bonjour',
    'Somalia': 'Maalim wanaqsan',
    'Suriname': 'Hallo',
    'Sao Tome and Principe': 'Hello',
    'El Salvador': 'Hola',
    'Syrian Arab Republic': 'Marhaba',
    'Swaziland': 'Hello',
    'Turks and Caicos Islands': 'Hello',
    'Chad': 'Marhaba',
    'Togo': 'Bonjour',
    'Thailand': 'Sawatdi',
    'Tajikistan': 'Salom',
    'Tokelau': 'Taloha',
    'Turkmenistan': 'Salam',
    'Tunisia': 'Marhaba',
    'Tonga': 'Malo e lelei',
    'Turkey': 'Merhaba',
    'Trinidad and Tobago': 'Hello',
    'Tuvalu': 'Talofa',
    'Taiwan': '&#20320;&#22909;',
    'Tanzania  United Republic of': 'Habari',
    'Ukraine': 'Pryvit',
    'Uganda': 'Habari',
    'United Kingdom': 'Hello',
    'United States Minor Outlying Islands': 'Hello',
    'United States': 'Hello',
    'Uruguay': 'Hola',
    'Uzbekistan': 'Salom',
    'Holy See (Vatican City State': 'Buon giorno',
    'Saint Vincent and the Grenadines': 'Hello',
    'Venezuela': 'Hola',
    'Virgin Islands  British': 'Hello',
    'Virgin Islands  U.S.': 'Hello',
    'Vietnam': 'Chào',
    'Vanuatu': 'Halo',
    'Wallis and Futuna': 'Malo le kataki',
    'Samoa': 'Talofa',
    'Yemen': 'Marhaba',
    'Mayotte': 'Hello',
    'South Africa': 'Hello',
    'Zambia': 'Hello',
    'Zimbabwe': 'Hello',
};