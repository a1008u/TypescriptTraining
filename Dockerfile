# -------------------------------
# typescriptのトランスパイル用
# -------------------------------
FROM node:12.18.1-alpine3.12 AS build

WORKDIR /app
COPY . /app
# RUN npm ci && npm run build
RUN npm run build

# -------------------------------
# トランスパイルコードの実行用
# -------------------------------
FROM node:12.18.1-alpine3.12
# FROM alpine:latest


WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY package.json /app
COPY package-lock.json /app


ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium \
    && npm install puppeteer@1.19.0

# Japanese font
RUN mkdir /noto
ADD https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip /noto
WORKDIR /noto
RUN unzip NotoSansCJKjp-hinted.zip && \
    mkdir -p /usr/share/fonts/noto && \
    cp *.otf /usr/share/fonts/noto && \
    chmod 644 -R /usr/share/fonts/noto/ && \
    /usr/bin/fc-cache -fv
RUN rm -rf /noto
WORKDIR /app

# # ENVの設定
# ENV CHROME_BIN="/usr/bin/chromium-browser"
# # ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

# # DL
# RUN set -x \
#   && apk update \
#   && apk upgrade \
#   && apk add --no-cache \
#   dumb-init \
#   udev \
#   ttf-freefont \
#   chromium

# # Cleanup
# RUN apk del --no-cache make gcc g++ binutils-gold gnupg libstdc++ \
#   && rm -rf /usr/include \
#   && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
#   && echo

# # ENV AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_REGION AWS_BUCKET_NAME

# # ADD ./package.json /usr/local/src/app/package.json
# RUN npm install

# # ADD ./index.ts /usr/local/src/app/index.ts
# # ADD ./screenshot.ts /usr/local/src/app/screenshot.ts
# # ADD ./aws-s3.ts /usr/local/src/app/aws-s3.ts

# # Installs latest Chromium (77) package.
# RUN apk add --no-cache \
#     chromium \
#     nss \
#     freetype \
#     freetype-dev \
#     harfbuzz \
#     ca-certificates \
#     ttf-freefont \
#     nodejs \
#     npm

# # Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
# # ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# # Puppeteer v1.19.0 works with Chromium 77.
# # RUN npm install puppeteer@1.19.0
# # RUN npm install chromium
# RUN npm install

# # Add user so we don't need --no-sandbox.
# RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
#     && mkdir -p /home/pptruser/Downloads /app \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /app

# # Run everything after as non-privileged user.
# USER pptruser
################################################################################



# # For Japan
# RUN sed -i -E "s@http://(archive|security)\.ubuntu\.com/ubuntu/@http://ftp.jaist.ac.jp/pub/Linux/ubuntu/@g" /etc/apt/sources.list

# # Basic
# RUN apt-get update \
#     && apt-get install -y sudo curl wget zip unzip git nodejs npm fontconfig \
#     && apt-get purge -y nodejs npm \
#     && curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
#     && apt-get install -y nodejs \
#     && npm install -g yarn

# # Chrome
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add - \
#     && sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable

# # Remove cache & workfile
# RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# # Japanese font
# RUN mkdir /noto
# ADD https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip /noto
# WORKDIR /noto
# RUN unzip NotoSansCJKjp-hinted.zip && \
#     mkdir -p /usr/share/fonts/noto && \
#     cp *.otf /usr/share/fonts/noto && \
#     chmod 644 -R /usr/share/fonts/noto/ && \
#     /usr/bin/fc-cache -fv
# WORKDIR /
# RUN rm -rf /noto

# Work dir
# RUN mkdir -p /app
# WORKDIR /app

CMD ["npm", "run","startPuppeteer"]