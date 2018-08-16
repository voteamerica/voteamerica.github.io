[![Build Status](https://travis-ci.org/voteamerica/voteamerica.github.io.svg?branch=master)](https://travis-ci.org/voteamerica/voteamerica.github.io)

# Carpool Vote

Carpool Vote connects volunteer drivers with anybody who needs a ride to claim their vote. We are a nonpartisan organisation: Our goal is to increase voter turnout and improve representation.

We successfully deployed the site for the US 2016 election and now we are working hard on improvements for the various US elections in 2017 and beyond. We're a team of volunteers from around the world, working pro bono in our free time alongside our day jobs. As a result, we need all the help we can get, and any contributions would be gratefully appreciated.

## Slack

We have a [Slack team](https://carpool-vote.slack.com/)! Please [email us](mailto:slack@carpoolvote.com) if you would like to join.

## Technical

This site runs on [Jekyll](https://jekyllrb.com/), and is hosted on [Github Pages](https://jekyllrb.com/docs/github-pages/) from this respository. We have an API set up at https://github.com/voteamerica/backend. The current live version of the API can be accessed via https://api.carpoolvote.com/live/, while a test version is at https://api.carpoolvote.com/test/. We currently have a staging environment connected to the test API at https://www.richardwestenra.com/voteamerica.github.io/.

### Installation
You'll need to have Ruby installed if you haven't already (ideally via a ruby version manager like [rbenv](https://github.com/rbenv/rbenv) or [RVM](https://rvm.io/)), and also [install Jekyll and Bundler](https://jekyllrb.com/docs/quickstart/) with `gem install jekyll bundler`.

Once Jekyll is installed, you can start a local server using `jekyll serve`. To connect to the test API (instead of the live one), run `jekyll serve --config _config.yml,_config-dev.yml` instead.

### URLs

The main site is available at http://carpoolvote.com/, but there is a mirror at http://souls2thepolls.org, which redirects to http://carpoolvote.com/?souls2thepolls. This mirror has a [different logo](http://carpoolvote.com/images/logo-souls2thepolls.png) and other small changes, which are handled in [querystring.js](https://github.com/voteamerica/voteamerica.github.io/blob/master/scripts/querystring.js) so that we don't need to maintain two separate websites.

### Operator page

This secured area is built in a modular style. The default style uses React/Redux, although it is possible to use raw JS etc. There is support for an automatically created dev environment (for Windows, Linux and Mac) on https://github.com/voteamerica/backend. 

## Contributing

If you're interested in contributing to this project, read our guidelines for [how to contribute](docs/contributing.md) first, and also please be aware of our [code of conduct](docs/code-of-conduct.md).