## React Router

The is the router I always wanted for react.

**react-router** makes it so that routing is as clean and awesome as the rest of react. The url is, after all, just a serialization of state, and react does state better than anyone.

### What you get to do

Declare your routes once, and then never have to worry about constructing or parsing urls again. Also, all route data is stored in `state` (`this.state._route` to be precise), so route changes (either browser or js initiated) will trigger all of the normal state-change handlers.

### An example

This looks complex, but then, routing can be a complex thing, and I want to demonstrate how powerful react-router is.

Your app has 2 main views: a "Photos" view, which is a paged listing of cat photos, and a "Settings" view. You want the default route `/` to show page 1 of the photos, and then subsequent pages are on the route `/page number`.

#### Default parameters
The `photos` route will match wither `/` or `/17`, etc. When `/` is matched, `route.params.page` will be the default, or `1`.

#### Never build a URL by hand again
`react-router` knows not only how to parse a url for arguments, but also how to serialize them back again. Notice the `goToPage` method doesn't construct the url `'/' + page`, but rather passes in the route name and the parameters, and everything else is taken care of.

```js
var Main = React.createComponent({
  mixins: [RouterMixin],
  routes: {
    settings: 'settings',
    photos: {
      match: ['', ':page'],
      args: {
        date: {
          type: Number, // Number, String, and Date are supported
          default: 1
        }
      }
    }
  },
  goToPage: function (page) {
    this.setRoute('photos', {page: page})
  },
  getMain: function () {
  	var route = this.getRoute()
    switch (route.page) {
      case 'settings':
      	return SettingsPage({})
      default:
        return PhotosPage({
          page: route.params.page,
          goToPage: this.goToPage
        })
    }
  },
  render: function () {
  	return (
      <Header/>
      {this.getMain()}
      <Footer/>
    )
  }
})
```

#### Custom Parameter Types
For the really adventurous, you can define your own parameter types, as long as you provide functions for serializing and deserializing them.

Here's an example of a simple `Month` type:

```js
var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun'] // we have a shorted year than most

// the url `/month/:month` with look like `/month/jan` but the params will look like `{month: 0}`
var MonthType = {
  months: months,
  match: months.join('|'), // a regex string for validation
  stringify: function (num) {
    return months[num]
  },
  parse: function (month) {
    return months.indexOf(month.toLowerCase())
  }
}
```

This allows you to do advanced pattern-matching as well; the `match` attribute gives you custom regex control. So, for example:

```js
first: {
  match: 'go/:month',
  args: {
    month: MonthType
  }
},
second: {
  match: 'go/:others'
}
```
The url `go/jan` would trigger the route `first`, while the url `go/somethere` would trigger the route `second`.
