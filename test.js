const RevaClient = require("./reva-client");

async function test() {
  const client = new RevaClient('localhost:19000', 'einstein', 'relativity');
  const res = await client.createOCMShare("marie", "cesnet.cz");
  console.log(res.getStatus().getCode());
  console.log(res.getShare());
}

// ...
test();