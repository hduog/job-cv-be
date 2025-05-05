import { Client } from '@elastic/elasticsearch';
import { env } from './environment';

let jobPortalElasticsearchInstance = null;

const esClient = new Client({
  node: env.ELASTICSEARCH_PORT,
  auth: {
    username: env.ELASTICSEARCH_NAME,
    password: env.ELASTICSEARCH_PASSWORD
  }
});
const CONNECT_ES = async () => {
  await esClient.ping();
  jobPortalElasticsearchInstance = esClient;
};
const GET_ES = () => {
  if (!jobPortalElasticsearchInstance) throw new Error('Must connect to es');
  return esClient;
};
export { CONNECT_ES, GET_ES };
