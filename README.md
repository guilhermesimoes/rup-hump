# RUP Hump Generator

A web app for plotting the amount of effort spent over time in a collection of RUP disciplines. Only possible due to the awesome [D3.js](http://d3js.org/) library.

## Usage

Feed it a `csv` file with the following structure:

```javascript
Date,Business Modeling,Requirements,Analysis and Design,Implementation,Test,Deployment,Configuration and Change Management,Project Management,Environment,In Class
2013-02-18,1,0,0,0,0,0,1,22.5,6,48
2013-02-25,7.24,0,0.66,0,0,0,0.75,43.5,0.08,48
2013-03-04,6,1.5,0,0,0,0,0,32.33,0.75,0
2013-03-11,1.5,20,0,0,0,0,0,9.75,11.5,50.75
2013-03-18,0,0,0,0,0,0,0,0,0,0
2013-03-25,0,0,0,0,0,0,0,0,0,0
2013-04-01,0,0,0,0,0,0,0,0,0,0
2013-04-08,0,0,0,0,0,0,0,0,0,0
2013-04-15,0,0,0,0,0,0,0,0,0,0
2013-04-22,0,0,0,0,0,0,0,0,0,0
2013-04-29,0,0,0,0,0,0,0,0,0,0
2013-05-06,0,0,0,0,0,0,0,0,0,0
2013-05-13,0,0,0,0,0,0,0,0,0,0
2013-05-20,0,0,0,0,0,0,0,0,0,0
```

Each row corresponds to a particular week. Each column corresponds to a particular RUP discipline.

Make sure that your dates follow the [ISO 8601](http://xkcd.com/1179/) format. Some browsers will fail to parse dates such as `2013-3-4` so use the standard format, `2013-03-04`.

You will end up with a chart like this:

![](https://raw.github.com/GuilhermeSimoes/rup-hump/master/assets/images/example.png)

## Development

First, install all the required gems with:

    bundle install

Then start a web server on port 3000 with:

    rackup --port 3000

## Contributing

1. Fork it.

2. Make it better.

3. Send me a pull request.
