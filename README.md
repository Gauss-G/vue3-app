# vue3-app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Docker 运行示例
#### 构建
```
docker build . -t vue3-app
```

#### 运行
```
docker run -d -p 8080:80 vue3-app
curl localhost:8080
# <!DOCTYPE html><html lang=en>...</html>
```


```
docker start interesting_maxwell
```