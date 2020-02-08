scp public/influenza/influenza.html root@scrat:/usr/share/nginx/html/s/influenza/

crontab -e

```
*/40 * * * * /bin/python /root/project/MiniServer/module/influenza/script/dingxiang.py > /tmp/dingxiang.log
```

https://scrats.cn/s/influenza/influenza.html
