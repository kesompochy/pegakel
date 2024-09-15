import { BunsonServer } from 'bunson';
import { save } from '~/save';
import { load } from '~/load';
import { exportGroup } from '~/exportGroup';

const methods = {
  hello: (params: {name: string}) => `Hello, ${params.name}!`,
  save: save,
  load: load,
  exportGroup: exportGroup,
}
const corsConfig = {
  origin: '*',
  allowedHeaders: ['Content-Type'],
}


const server = new BunsonServer(methods, corsConfig);
export default server;
