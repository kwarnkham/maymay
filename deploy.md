```
scp pwa.zip root@coffee.book-mm.com:/root/

cd /etc/nginx/html/clinic && rm -rf ./* && mv /root/pwa.zip ./pwa.zip && unzip pwa.zip && rm -rf pwa.zip && mv pwa/* ./ && rm -rf pwa

systemctl restart nginx
```
