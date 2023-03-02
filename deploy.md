```
scp pwa.zip root@facile.madewithheart.tech:/root/

cd /var/www/maymay-clinic && rm -r ./* && mv /root/pwa.zip ./pwa.zip && unzip pwa.zip && rm pwa.zip && mv pwa/* ./ && rm -r pwa

systemctl restart nginx
```
