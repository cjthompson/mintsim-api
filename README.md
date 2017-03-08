# mintsim-api

`mintsim-api` is a client to get account MintSIM account information, such as total 4G data used.

The inital version will display your 4G data usage;

## Usage

Run the script with two parameters: 1. Phone number, 2. Password

```bash
node index.js 1231231234 myPa$$w0rd
```

## node 7.x
The code leverages several ECMAScript features that are only available in node 7.x, such as async functions and destructuring.  If you wish to use it with lower node versions, you can manually install and run babel.
