var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput.jsx');
var classNames = require('classnames');

var TodoItem = React.createClass({
  proptypes: {
    todo: ReactPropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      isEditing: false
    };
  },

  render: function(){
    var todo = this.props.todo;
    var input;

    if(this.state.isEditing){
      input = <TodoTextInput className = "edit" onSave={this.onSave} value={todo.text} />
    }

    return (
        <li className={classNames({'completed': todo.complete, 'editing': this.state.isEditing })} key={todo.id}>
          <div className="view">
            <input className="toggle" type="checkbox" checked={todo.complete} onChange={this.onToggleComplete} />
            <label onDoubleClick={this.onDoubleClick}>{todo.text}</label>
            <button className="destroy" onClick={this.onDestroyClick} />
          </div>
          {input}
        </li>

      )
  },

  onToggleComplete: function(){
    TodoActions.toggleComplete(this.props.todo);
  },

  onDoubleClick: function(){
    this.setState({isEditing: true});
  },

  onSave: function(text){
    TodoActions.updateText(this.props.todo.id, text);
    this.setState({isEditing: false});
  },

  onDestroyClick: function(){
    TodoActions.destroy(this.props.todo.id);
  }

});

module.exports = TodoItem;
