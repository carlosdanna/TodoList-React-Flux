var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var todos = {};

function create(text)
{
  var id = (+new Date() + Math.floor(Math.random()*99999)).toString(36);
  todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}

function update(id, updates)
{
  todos[id] = assign({}, todos[id], updates);
}

function updateAll(updates)
{
  for(var id in todos){
    update(id, updates);
  }
}

function destroy(id)
{
  delete todos[id];
}

function destroyCompleted()
{
  for (var id in todos)
  {
    if(todos[id].complete)
    {
      destroy(id);
    }
  }
}

var TodoStore = assign({}, EventEmitter.prototype, {
  areAllComplete: function(){
    for (var id in todos){
      if (!todos[id].complete){
        return false;
      }
    }
    return true;
  },

  getAll: function(){
    return todos;
  },

  emitChange: function(){
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback){
    console.log("addChangeListener", callback);
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback){
    console.log("removeChangeListener", callback);
    this.on(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action){
  var text;
  switch(action.actionType){
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== ''){
        create(text);
        TodoStore.emitChange();
      }
      break;

    case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
      if(TodoStore.areAllComplete()){
        updateAll({complete: false});
      }else{
        updateAll({complete: true});
      }
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_UNDO_COMPLETE:
      update(action.id, {complete: false});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_COMPLETE:
      update(action.id, {complete: true});
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if(text !== ''){
        update(action.id, {text: text});
        TodoStore.emitChange();
      }
      break;

    case TodoConstants.TODO_DESTROY:
      destroy(action.id);
      TodoStore.emitChange();
      break;

    case TodoConstants.TODO_DESTROY_COMPLETED:
      destroyCompleted();
      TodoStore.emitChange();
      break;

    default:

  }
});

module.exports = TodoStore;
