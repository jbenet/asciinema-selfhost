# asciinema-selfhost -- ipfs <3 asciinema

[asciinema](http://asciinema.org) is awesome! I love it. However, i often want to show or send asciinemas without depending on the internet working, or working fast.

`asciinema-selfhost` downloads an asciinema from asciinema.org and makes a small static website. It has all the necessary data, js, and css. It is completely self-hosted! It can be published anywhere, and even works offline!

Install with
```sh
npm install -g asciinema-selfhost
```

[![](http://gateway.ipfs.io/ipfs/QmSWnauy7tquRmh1PwahrZP5Pj8uiRVTTL916rkyyeJ9z6/cap.png)](http://gateway.ipfs.io/ipfs/QmdEaGfwzkNHQtxgp3XWxPgeuCEKecEHLSPnCUUpz3W7zs/)

## What is this

This tool will download all the assets representing an asciinema, and it will prepare a static directiory. Optionally, it can publish them to IPFS.

## How it works

This script is run _after_ you upload to asciinema.org. We hope to be able to avoid the hassle of relying on specific network hosts (because sometimes the internet is slow, or not there...). But for now some necessary post-processing is done server-side. So:

1. Run `asciinema` to record as usual
2. Upload to asciinema.org
3. Run `asciinema-rehost --clone <id>` to download it.
4. Run `asciinema-rehost --rehost <id>` to publish to ipfs.

## Install

From npm:

```sh
npm install -g asciinema-selfhost
```

## Usage

```sh
> asciinema-selfhost -h
asciinema-selfhost <asciinema-id> - self-host asciinema

Options:
  -h, --help   show this help output
  -c, --clone  clone asciinema
  -j, --json   fetch asciinema.json
  -s, --size   rehost asciinema to ipfs
```

## Examples

### `--clone <id>` to make a static website

`--clone` downloads an asciinema and makes a small static website. It has all the necessary data, js, and css. It is completely self-hosted! It can be published anywhere, and even works offline!

```sh
> asciinema-selfhost --clone 8mi43wht7qnbcivang0gxu6vh myAsciinema
cloning 8mi43wht7qnbcivang0gxu6vh to myAsciinema
copying /Users/jbenet/git/asciinema-selfhost/build to myAsciinema
writing myAsciinema/data/asciinema.json
writing myAsciinema/data/size.json
writing myAsciinema/iframe.html
```

### `--rehost <id>` to publish static website to ipfs

`--rehost` does what `--clone` does and takes it a step further: it publishes the static website on [ipfs](http://ipfs.io). This makes the asciinema viewable by anyone on the HTTP gateway, or in an offline ipfs network.

```sh
asciinema-selfhost --rehost 8mi43wht7qnbcivang0gxu6vh
cloning 8mi43wht7qnbcivang0gxu6vh to /tmp/asciinema/8mi43wht7qnbcivang0gxu6vh
copying /Users/jbenet/git/asciinema-selfhost/build to /tmp/asciinema/8mi43wht7qnbcivang0gxu6vh
writing /tmp/asciinema/8mi43wht7qnbcivang0gxu6vh/data/asciinema.json
writing /tmp/asciinema/8mi43wht7qnbcivang0gxu6vh/data/size.json
writing /tmp/asciinema/8mi43wht7qnbcivang0gxu6vh/iframe.html

adding to ipfs. make sure your ipfs daemon is running.
ipfs add -r /tmp/asciinema/8mi43wht7qnbcivang0gxu6vh
published to /ipfs/QmdEaGfwzkNHQtxgp3XWxPgeuCEKecEHLSPnCUUpz3W7zs
view locally at http://localhost:8080/ipfs/QmdEaGfwzkNHQtxgp3XWxPgeuCEKecEHLSPnCUUpz3W7zs
view globally at http://gateway.ipfs.io/ipfs/QmdEaGfwzkNHQtxgp3XWxPgeuCEKecEHLSPnCUUpz3W7zs
```

### Show me!

See it live here:

[![](http://gateway.ipfs.io/ipfs/QmY1Zo1DTt9D89HM3PAuHNjm81yAHA1JEtXcE2m6tKepWU/cap.png)](http://gateway.ipfs.io/ipfs/QmdEaGfwzkNHQtxgp3XWxPgeuCEKecEHLSPnCUUpz3W7zs/)
