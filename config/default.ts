export default {
  appUrl: 'http://localhost:3000',
  serverPort: 3000,
  dbConfig: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: '3fchain_dev',
    password: '3fchain_dev',
    database: '3fchain_dev',
    logging: true,
    ssl: false,
  },
  azureBlobConfig: {
    blobConnectionString:
      'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;',
  },
};
