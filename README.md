#### For testing:

```
curl localhost:4000/graphql \
 -F operations='{ "query": "mutation($files: [Upload], $channelId: Int!) { processWine(files: $files, channelId: $channelId) { id } }", "variables": { "files": [null, null], "channelId": 1 } }' \
 -F map='{ "0": ["variables.files.0"], "1": ["variables.files.1"] }' \
 -F 0=@$HOME/image1.jpeg \
 -F 1=@$HOME/image2.jpeg
```