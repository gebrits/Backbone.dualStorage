// Generated by CoffeeScript 1.9.0
(function() {
  var Store, localStorage;

  Store = window.Store, localStorage = window.localStorage;

  describe('window.Store', function() {
    var model, store, _ref;
    _ref = {}, store = _ref.store, model = _ref.model;
    beforeEach(function() {
      localStorage.clear();
      localStorage.setItem('cats', '3');
      localStorage.setItem('cats3', '{"id": "3", "color": "burgundy"}');
      return store = new Store('cats');
    });
    describe('creation', function() {
      return it('takes a name in its constructor', function() {
        store = new Store('convenience store');
        return expect(store.name).toBe('convenience store');
      });
    });
    describe('persistence', function() {
      describe('find', function() {
        it('fetches records by id', function() {
          return expect(store.find({
            id: 3
          })).toEqual({
            id: '3',
            color: 'burgundy'
          });
        });
        it('does not try to JSON.parse null values', function() {
          spyOn(JSON, 'parse');
          store.find({
            id: 'unpersistedId'
          });
          return expect(JSON.parse).not.toHaveBeenCalledWith(null);
        });
        return it('returns null when not found', function() {
          var result;
          result = store.find({
            id: 'unpersistedId'
          });
          return expect(result).toBeNull();
        });
      });
      it('fetches all records with findAll', function() {
        return expect(store.findAll()).toEqual([
          {
            id: '3',
            color: 'burgundy'
          }
        ]);
      });
      it('clears out its records', function() {
        store.clear();
        expect(localStorage.getItem('cats')).toBe('');
        return expect(localStorage.getItem('cats3')).toBeNull();
      });
      it('creates records', function() {
        model = {
          id: 2,
          color: 'blue'
        };
        store.create(model);
        expect(localStorage.getItem('cats')).toBe('3,2');
        return expect(JSON.parse(localStorage.getItem('cats2'))).toEqual({
          id: 2,
          color: 'blue'
        });
      });
      it('overwrites existing records with the same id on create', function() {
        model = {
          id: 3,
          color: 'lavender'
        };
        store.create(model);
        return expect(JSON.parse(localStorage.getItem('cats3'))).toEqual({
          id: 3,
          color: 'lavender'
        });
      });
      it('generates an id when creating records with no id', function() {
        localStorage.clear();
        store = new Store('cats');
        model = {
          color: 'calico',
          idAttribute: 'id',
          set: function(attribute, value) {
            return this[attribute] = value;
          }
        };
        store.create(model);
        expect(model.id).not.toBeNull();
        return expect(localStorage.getItem('cats')).toBe(model.id);
      });
      it('updates records', function() {
        store.update({
          id: 3,
          color: 'green'
        });
        return expect(JSON.parse(localStorage.getItem('cats3'))).toEqual({
          id: 3,
          color: 'green'
        });
      });
      return it('destroys records', function() {
        store.destroy({
          id: 3
        });
        expect(localStorage.getItem('cats')).toBe('');
        return expect(localStorage.getItem('cats3')).toBeNull();
      });
    });
    return describe('offline', function() {
      it('on a clean slate, hasDirtyOrDestroyed returns false', function() {
        return expect(store.hasDirtyOrDestroyed()).toBeFalsy();
      });
      it('marks records dirty and clean, and reports if it hasDirtyOrDestroyed records', function() {
        store.dirty({
          id: 3
        });
        expect(store.hasDirtyOrDestroyed()).toBeTruthy();
        store.clean({
          id: 3
        }, 'dirty');
        return expect(store.hasDirtyOrDestroyed()).toBeFalsy();
      });
      it('marks records destroyed and clean from destruction, and reports if it hasDirtyOrDestroyed records', function() {
        store.destroyed({
          id: 3
        });
        expect(store.hasDirtyOrDestroyed()).toBeTruthy();
        store.clean({
          id: 3
        }, 'destroyed');
        return expect(store.hasDirtyOrDestroyed()).toBeFalsy();
      });
      return it('cleans the list of dirty or destroyed models out of localStorage after saving or destroying', function() {
        var collection;
        collection = new Backbone.Collection([
          {
            id: 2,
            color: 'auburn'
          }, {
            id: 3,
            color: 'burgundy'
          }
        ]);
        collection.url = 'cats';
        store.dirty({
          id: 2
        });
        store.destroyed({
          id: 3
        });
        expect(store.hasDirtyOrDestroyed()).toBeTruthy();
        collection.get(2).save();
        collection.get(3).destroy();
        expect(store.hasDirtyOrDestroyed()).toBeFalsy();
        expect(localStorage.getItem('cats_dirty').length).toBe(0);
        return expect(localStorage.getItem('cats_destroyed').length).toBe(0);
      });
    });
  });

}).call(this);

//# sourceMappingURL=localstorage_store_spec.js.map
