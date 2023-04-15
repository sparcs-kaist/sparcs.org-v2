FROM node:16

RUN mkdir /sparcs.org-v2
WORKDIR /sparcs.org-v2

ADD package.json /sparcs.org-v2/package.json
RUN npm install

ADD . /sparcs.org-v2
RUN npm run build

CMD ["npm", "start"]
