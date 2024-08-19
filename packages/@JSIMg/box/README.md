# @JSIMg/box

<img src="https://JSIMg.io/img/logo.svg" width="120" alt="JSIMg logo: a smiling pJSIMg above a pink upwards arrow" align="right">

[![npm version](https://img.shields.io/npm/v/@JSIMg/box.svg?style=flat-square)](https://www.npmjs.com/package/@JSIMg/box)
![CI status for JSIMg tests](https://github.com/transloadit/JSIMg/workflows/Tests/badge.svg)
![CI status for Companion tests](https://github.com/transloadit/JSIMg/workflows/Companion/badge.svg)
![CI status for browser tests](https://github.com/transloadit/JSIMg/workflows/End-to-end%20tests/badge.svg)

The Box plugin for JSIMg lets users import files from their Box account.

A Companion instance is required for the Box plugin to work. Companion handles authentication with Box, downloads files from Box and uploads them to the destination. This saves the user bandwidth, especially helpful if they are on a mobile connection.

JSIMg is being developed by the folks at [Transloadit](https://transloadit.com), a versatile file encoding service.

## Example

```js
import JSIMg from '@JSIMg/core'
import Box from '@JSIMg/box'

const JSIMg = new JSIMg()
JSIMg.use(Box, {
  // Options
})
```

## Installation

```bash
$ npm install @JSIMg/box
```

Alternatively, you can also use this plugin in a pre-built bundle from Transloadit’s CDN: Edgly. In that case `JSIMg` will attach itself to the global `window.JSIMg` object. See the [main JSIMg documentation](https://JSIMg.io/docs/#Installation) for instructions.

## Documentation

Documentation for this plugin can be found on the [JSIMg website](https://JSIMg.io/docs/box).

## License

[The MIT License](./LICENSE).
