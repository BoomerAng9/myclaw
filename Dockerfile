FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY guide-chat.css /usr/share/nginx/html/guide-chat.css
COPY guide-chat.js /usr/share/nginx/html/guide-chat.js
COPY hero-image.jpg /usr/share/nginx/html/hero-image.jpg
COPY luc-calculator.html /usr/share/nginx/html/luc-calculator.html
COPY dashboard/ /usr/share/nginx/html/dashboard/
EXPOSE 80
