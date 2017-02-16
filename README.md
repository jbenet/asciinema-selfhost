# asciinema-selfhost -- ipfs <3 asciinema

[asciinema](http://asciinema.org) is awesome! I love it. However, i often want to show or send asciinemas without depending on the internet working, or working fast.

`asciinema-selfhost` downloads an asciinema from asciinema.org and makes a small static website. It has all the necessary data, js, and css. It is completely self-hosted! It can be published anywhere, and even works offline!

Install with
```sh
npm install -g asciinema-selfhost
```

[![](http://gateway.ipfs.io/ipfs/QmSWnauy7tquRmh1PwahrZP5Pj8uiRVTTL916rkyyeJ9z6/cap.png)](https://ipfs.io/ipfs/QmVNk5fhsdzBdKxNBXodet6DsWQCjAWbmooBWxRscLeqRq/)

## What is this

This tool will download all the assets representing an asciinema, and it will prepare a static directiory. Optionally, it can publish them to IPFS.

## Self-hosting

This script is run _after_ you upload to asciinema.org. We hope to be able to avoid the hassle of relying on specific network hosts (because sometimes the internet is slow, or not there...). But for now some necessary post-processing is done server-side. So:

1. Run `asciinema rec <filename>` to record to a local file.
2. Run `asciinema-selfhost -f <filename>` to publish a self-contained player to ipfs.

```
> asciinema rec my-asciinema.json
~ Asciicast recording started.
~ Hit Ctrl-D or type "exit" to finish.
> echo do my fancy stuff here
do my fancy stuff here
> exit
~ Asciicast recording finished.
> asciinema-selfhost -f my-asciinema.json
self-hosting asciinema my-asciinema.json
copying /Users/jbenet/git/asciinema-selfhost/tmpl to /tmp/asciinema/tmp-Jl6zov
writing /tmp/asciinema/tmp-Jl6zov/data/asciinema.json
writing /tmp/asciinema/tmp-Jl6zov/data/size.json
writing /tmp/asciinema/tmp-Jl6zov/iframe.html

adding to ipfs. make sure your ipfs daemon is running.
ipfs add -r /tmp/asciinema/tmp-Jl6zov
published to /ipfs/QmcejM7hDGoWxbTeafvxCudRHWo5f3NoiEGBmjukRAN9eU
view locally at http://localhost:8080/ipfs/QmcejM7hDGoWxbTeafvxCudRHWo5f3NoiEGBmjukRAN9eU
view globally at http://gateway.ipfs.io/ipfs/QmcejM7hDGoWxbTeafvxCudRHWo5f3NoiEGBmjukRAN9eU
```

### See it here:

[![](https://ipfs.io/ipfs/QmdxuPWGuCQrf4zGQtxYqxUWJDMWG5wRScn6SpfLKGTTAx/asciinema-cover.png)](https://ipfs.io/ipfs/QmVNk5fhsdzBdKxNBXodet6DsWQCjAWbmooBWxRscLeqRq/)


## Re-hosting from asciinema.org

If you want to grab a recording from asciinema.org and re-host it in IPFS, you can do the following:

1. Get the URL for the asciinema you want to record.
2. Run `asciinema-rehost --rehost <URL>` to publish to ipfs.

## Install

From npm:

```sh
npm install -g asciinema-selfhost
```

## Usage

```sh
> asciinema-selfhost --help
Usage: asciinema-selfhost --file <asciinema-file>
       asciinema-selfhost --clone <asciinema-id> [<path>]
       asciinema-selfhost --rehost <asciinema-id>

Clone asciinemas as small static websites, and then self host them
on any webserver. Or use --rehost to publish them straight to ipfs!

Options:
  -h, --help    show this help output
  -f, --file    host asciinema from file in ipfs
  -c, --clone   clone asciinema
  -r, --rehost  rehost asciinema to ipfs
  -j, --json    fetch asciinema.json
  -s, --size    fetch asciinema size
```

## Examples

### `-f, --file <file>` to make a static website for file

`--file` uses an asciinema file, and makes a small static website. It has all the necessary data, js, and css. It publishes the static website on [ipfs](http://ipfs.io). This makes the asciinema viewable by anyone on the HTTP gateway, or in an offline ipfs network.

```sh
> asciinema-selfhost --file my-asciinema.json
self-hosting asciinema my-asciinema.json
copying /Users/jbenet/git/asciinema-selfhost/tmpl to /tmp/asciinema/tmp-Jl6zov
writing /tmp/asciinema/tmp-Jl6zov/data/asciinema.json
writing /tmp/asciinema/tmp-Jl6zov/data/size.json
writing /tmp/asciinema/tmp-Jl6zov/iframe.html

adding to ipfs. make sure your ipfs daemon is running.
ipfs add -r /tmp/asciinema/tmp-Jl6zov
published to /ipfs/QmcejM7hDGoWxbTeafvxCudRHWo5f3NoiEGBmjukRAN9eU
view locally at http://localhost:8080/ipfs/QmcejM7hDGoWxbTeafvxCudRHWo5f3NoiEGBmjukRAN9eU
view globally at http://gateway.ipfs.io/ipfs/QmcejM7hDGoWxbTeafvxCudRHWo5f3NoiEGBmjukRAN9eU
```

### `-c, --clone <id>` to make a static website

`--clone` downloads an asciinema and makes a small static website. It has all the necessary data, js, and css. It is completely self-hosted! It can be published anywhere, and even works offline!

```sh
> asciinema-selfhost --clone 8mi43wht7qnbcivang0gxu6vh myAsciinema
cloning 8mi43wht7qnbcivang0gxu6vh to myAsciinema
copying /Users/jbenet/git/asciinema-selfhost/build to myAsciinema
writing myAsciinema/data/asciinema.json
writing myAsciinema/data/size.json
writing myAsciinema/iframe.html
```

### `-r, --rehost <id>` to publish static website to ipfs

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
