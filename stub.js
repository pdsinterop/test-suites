const https = require('https');
const fs = require('fs');

const server = https.createServer({
	key: fs.readFileSync('/etc/letsencrypt/live/nc2.pdsinterop.net/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/nc2.pdsinterop.net/cert.pem'),
	ca: fs.readFileSync('/etc/letsencrypt/live/nc2.pdsinterop.net/chain.pem')
}, (req, res) => {
	console.log(req.method, req.url, req.headers);
	req.on('data', (chunk) => {
		console.log('CHUNK', chunk.toString());
	});
	req.on('end', () => {
	  if (req.url === '//ocs-provider/') {
            console.log('yes //ocs-provider/');
            res.end(JSON.stringify({
              version: 2,
              services: {
                FEDERATED_SHARING: {
                  version: 1,
                    endpoints: {
                      share: "/ocs/v2.php/cloud/shares",
                      webdav: "/public.php/webdav/"
                    }
                  },
                }
	    }));
          } else if (req.url === '/ocm/shares') {
            console.log('yes /ocm/shares');
	    res.writeHead(201);
	    res.end('Created');
          } else if (req.url === '/ocm-provider/') {
            console.log('yes /ocm-provider/');
            res.end(JSON.stringify({
	      enabled: true,
	      apiVersion: "1.0-proposal1",
		    "endPoint":"https://nc2.pdsinterop.net/ocm",
		    "resourceTypes":[{
			    "name":"file",
			    "shareTypes":["user","group"],
			    "protocols":{"webdav":"/public.php/webdav/"
			    }
		    }]
	    }));
          } else {
            console.log('not recognized');
	    res.end('OK');
	  }
	});
});
server.listen(443);

