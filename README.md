# machine-learning

## Project Setup (development)
```
install python 2.7 (required by @tensorflow/tfjs-node)
npm install
```

## Project Setup (production)
```
npm install --only=production
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and runs only backend for development
```
npm run backend
```

### Compiles and runs production without @tensorflow/tfjs-node support
```
npm run serve --prod true -- --port 8000
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
