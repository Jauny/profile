$(function () {
  // Cell Model
  Cell = Backbone.Model.extend({
    initialize: function(alive) {
      this.alive = alive || false;

      this.listenTo(this, 'toggleStatus', this.toggleStatus);
    },

    status: function() {
      return this.alive ? 'alive' : 'dead';
    },

    toggleStatus: function() {
      this.alive = !this.alive;
    }
  });

  // Cell view
  CellView = Backbone.View.extend({
    tagName: 'div',
    className: 'cell',
    template: _.template($('#cell-view-template').html()),

    events: {
      'click': 'toggleStatus'
    },

    initialize: function() {
      this.listenTo(this.model, 'toggleStatus', this.toggleClass);
    },

    toggleStatus: function() {
      this.model.trigger('toggleStatus');
    },

    toggleClass: function() {
      $(this.el).attr('class', 'cell ' + this.model.status());
    },

    render: function() {
      this.$el.html(this.template(this.model)).addClass(this.model.status());

      return this;
    }
  });

  // Cells Collection (board)
  Cells = Backbone.Collection.extend({
    model: Cell,

    // board for next life cycle
    nextBoard: [],

    initialize: function() {
      this.listenTo(this, 'nextLifeCycle', this.nextLifeCycle);
    },

    cellIndex: function(cell) {
      return this.models.indexOf(cell);
    },

    cellLeft: function(cell) {
      var index = this.cellIndex(cell);
      if (index % WIDTH == 0) {
        return null;
      } else {
        return this.models[index - 1];
      }
    },

    cellRight: function(cell) {
      var index = this.cellIndex(cell);
      if ((index + 1) % WIDTH == 0) {
        return null;
      } else {
        return this.models[index + 1];
      }
    },

    cellTop: function(cell) {
      var index = this.cellIndex(cell);
      if (index < WIDTH) {
        return null;
      } else {
        return this.models[index - WIDTH];
      }
    },

    cellBot: function(cell) {
      var index = this.cellIndex(cell);
      if ((index + WIDTH) < WIDTH*HEIGHT) {
        return this.models[index + WIDTH];
      } else {
        return null;
      }
    },

    cellTopLeft: function(cell) {
      var index = this.cellIndex(cell);
      if ((index < WIDTH) || (index % WIDTH == 0)) {
        return null;
      } else {
        return this.models[index - WIDTH - 1];
      }
    },

    cellTopRight: function(cell) {
      var index = this.cellIndex(cell);
      if ((index < WIDTH) || ((index + 1) % WIDTH == 0)) {
        return null;
      } else {
        return this.models[index - WIDTH + 1];
      }
    },

    cellBotLeft: function(cell) {
      var index = this.cellIndex(cell);
      if (((index + WIDTH) >= WIDTH*HEIGHT) || (index % WIDTH == 0)) {
        return null;
      } else {
      return this.models[index + WIDTH - 1];
      }
    },

    cellBotRight: function(cell) {
      var index = this.cellIndex(cell);
      if (((index + WIDTH) >= WIDTH*HEIGHT) || (((index + 1) % WIDTH) == 0)) {
        return null;
      } else {
        return this.models[index + WIDTH + 1];
      }
    },

    getNeighbors: function(cell) {
      var neighbors = [];
      neighbors.push(this.cellLeft(cell));
      neighbors.push(this.cellRight(cell));
      neighbors.push(this.cellTop(cell));
      neighbors.push(this.cellBot(cell));
      neighbors.push(this.cellTopLeft(cell));
      neighbors.push(this.cellTopRight(cell));
      neighbors.push(this.cellBotLeft(cell));
      neighbors.push(this.cellBotRight(cell));

      return _.reject(neighbors, function(cell) {
        return (cell == null) || (cell && cell.status() == 'dead');
      });
    },

    nextLifeCycle: function() {
      var _this = this;

      _.each(_this.models, function(model) {
        var neighbors = _this.getNeighbors(model);

        if (model.alive) {
          if (neighbors.length == 2 || neighbors.length == 3) {
            _this.nextBoard.push(new Cell(true));
          } else {
            _this.nextBoard.push(new Cell(false));
          }
        } else {
          if (neighbors.length == 3) {
            _this.nextBoard.push(new Cell(true));
          } else {
            _this.nextBoard.push(new Cell(false));
          }
        }
      })

      _this.models = _this.nextBoard;
      _this.nextBoard = [];
      this.trigger('renderNextBoard');
    }
  });

  // Cells Collection View
  CellsView = Backbone.View.extend({
    el: $('#board'),

    initialize: function() {
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'change', this.render);
      this.listenTo(this.collection, 'renderNextBoard', this.render);
    },

    addOne: function(model) {
      var cellView = new CellView({
        model: model,
        collection: this.collection,
      });

      // append cellView to the DOM
      this.$el.append(cellView.render().el);
    },

    render: function() {
      this.$el.html('');
      this.collection.forEach(this.addOne, this);

      return this;
    }
  });

  // life cycle button view
  NextView = Backbone.View.extend({
    el: '#nextLife',

    events: {
      'click': 'nextLifeCycle'
    },

    nextLifeCycle: function() {
      this.collection.trigger('nextLifeCycle');
    }
  });

  // main app
  App = Backbone.View.extend({
    el: $('#board'),

    initialize: function() {
      this.cells = new Cells();
      this.cellsView = new CellsView({
        collection: this.cells
      });
      this.next = new NextView({
        collection: this.cells
      });
    },

    start: function() {
      for (var i = 0; i < (WIDTH*HEIGHT); i++) {
        this.cells.add(new Cell);
      }
    }
  });

  // initialize everything
  HEIGHT = 20;
  WIDTH = 20;

  window.app = new App();
  window.app.start();
});
