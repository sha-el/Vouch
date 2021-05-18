FROM node:latest as react

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ./vouch-admin/package.json ./
COPY ./vouch-admin/yarn.lock ./
RUN yarn
RUN yarn add react-scripts -g --silent

# add app
COPY ./vouch-admin ./
RUN ls -l

RUN yarn build

# Rust setup
FROM rust:1.50.0 as planner
WORKDIR /app
# We only pay the installation cost once, 
# it will be cached from the second build onwards
RUN cargo install cargo-chef 
COPY . .
RUN cargo chef prepare  --recipe-path recipe.json

FROM rust:1.50.0 as cacher
WORKDIR /app
RUN cargo install cargo-chef
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

FROM rust:1.50.0 as builder
WORKDIR /app
COPY . .
# Copy over the cached dependencies
COPY --from=cacher /app/target target
COPY --from=cacher /usr/local/cargo /usr/local/cargo
RUN cargo build --release --bin vouch
RUN cargo build --release --bin vouch_cli

FROM ubuntu:latest as runtime
COPY --from=builder /app/target/release/vouch .
COPY --from=builder /app/target/release/vouch_cli .
RUN mkdir public
COPY --from=react /app/build ./public/
RUN chmod +x vouch
CMD ["/vouch"]
