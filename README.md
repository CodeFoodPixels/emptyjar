# EmptyJar

A self-hosted analytics system that doesn't use cookies

## Storage config

### Sqlite

```
{
  storageDriver: "sqlite",
  storageOptions: {
    location: ".data/hits.db"
  }
}
```

### MongoDB

```
{
  "storageDriver": "mongodb",
  "storageOptions": {
    "url": "mongodb://localhost:27017",
    "db": "emptyjar"
  }
}
```
