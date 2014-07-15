
React Router is heavily inspired by Ember, but with some key differences that
are distinctive to the React paradigm.

It is implemented as a mixin.

**currently in heavy development**

Benefits:

- route is tied to state
- setting page title is handled for you
- routes are defined declaratively
- routes are defined locally, one level at a time

```js
var Router = require('react-router')
  , ListProjects = require('./list-projects.jsx')
  , NewProject = require('./new-project.jsx')
  , Project = require('./project.jsx')

var Projects = React.createClass({
  mixins: [Router],
  routes: {
    '/': ListProjects,
    '/new': NewProject,
    '/*': [Project, function () {
      return {
        projectList: this.goTo.bind(null, '/')
      }
    }]
  },
  title: function () {
    return 'Project List'
  },
  render: function () {
    return (
      <div className='projects'>
        {this.outlet()}
      </div>
    )
  }
})

```

