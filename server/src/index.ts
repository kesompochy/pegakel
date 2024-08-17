import { BunsonServer } from 'bunson';

const methods = {
  hello: (params: {name: string}) => `Hello, ${params.name}!`,
}
const corsConfig = {
  origin: '*',
  allowedHeaders: ['Content-Type'],
}


const server = new BunsonServer(methods, corsConfig);
export default server;
