import PocketBase from 'pocketbase';

export const environment = {
  baseUrl: `http://127.0.0.1:8090`,
  pb: new PocketBase('http://127.0.0.1:8090'),
};
