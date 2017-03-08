'use strict';
const [phoneNum, password] = process.argv.slice(-2);
const pathPrefix = require('rest/interceptor/pathPrefix');
const timeout = require('rest/interceptor/timeout');
const template = require('rest/interceptor/template');
const defaultRequest = require('rest/interceptor/defaultRequest');
const errorCode = require('rest/interceptor/errorCode');
const mime = require('rest/interceptor/mime');
const rest = require('rest');
const client = rest
  .wrap(errorCode)
  .wrap(mime)
  .wrap(timeout, { timeout: 30000 })
  .wrap(pathPrefix, { prefix: 'https://api.mintsim.com/v1/mint' })
  .wrap(defaultRequest, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.74 Safari/537.36 Vivaldi/1.8.770.9',
      Origin: 'https://my.mintsim.com'
    }
  })
  .wrap(template);

function getToken() {
  return rest({
    path: 'https://my.mintsim.com'
  })
  .then(res => /window\.TOKEN = '(.*)';/.exec(res.entity)[1]);
}

function login(token) {
  return client({
    path: '/login',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    entity: { msisdn: phoneNum, password: password }
  })
  .then(res => res.entity);
}

function getData(token, id) {
  return client({
    path: '/account/{id}/data',
    params: { id },
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.entity);
}

async function start() {
  try {
    const {id, token} = (await login(await getToken()));
    const data = await getData(token, id);
    console.log(`4G Data Usage: ${data.usage4G} MB`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

start();
