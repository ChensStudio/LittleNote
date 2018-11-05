Template['myapp'].helpers

  tabSettings: ->
    defaultPath: @tab || "first"
    root: 'myapp'
    type: 'horizontal'
    tabs:  [

      ###
        First Tab
      ###
      path: 'first'
      name: 'First'
      template: 'users'
      data:
        users: Meteor.users.find().fetch()
    ,

      ###
        Yield Tab
      ###
      path: 'yield'
      name: 'Yield'
      template: 'other'
    ,

      ###
        HTML Tab
      ###
      path: 'html'
      name: 'HTML'
      onAfterAction: ->
        console.log 'html tab rendered'
    ,