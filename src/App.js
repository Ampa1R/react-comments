import React, { Component } from 'react';
import List from './components/List';
import New from './components/New';
import './scss/App.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      comments: [],
      commentAuthor: '',
      commentValue: '',
      error: ''
    }
  }
  componentDidMount() {
    const comments = localStorage.getItem('comments');
    if(comments)
      this.setState({comments: JSON.parse(comments)});
  }
  commentAuthorChangeHandler = e => {
    this.setState({commentAuthor: e.target.value});
  }
  commentValueChangeHandler = e => {
    const lastChar = e.target.value.charAt(e.target.value.length - 1);
    if(lastChar === '<' || lastChar === '>')
      return;
    this.setState({commentValue: e.target.value});
  }
  commentCreateHandler = () => {
    if(!this.state.commentAuthor || !this.state.commentValue) {
      this.setState({error: 'Заполнены не все поля'});
      return;
    }
    const d = new Date();
    const newID = (this.state.comments[0]) ? this.state.comments[0].id + 1 : 0;

    const hour = d.getHours().toString().padStart(2, 0);
    const minute = d.getMinutes().toString().padStart(2, 0);
    const day = d.getDay().toString().padStart(2, 0);
    const month = d.getMonth().toString().padStart(2, 0);
    const year = d.getFullYear();

    const newComment = {
      id: newID,
      created: `${hour}:${minute} ${day}.${month}.${year}`,
      author: this.state.commentAuthor,
      text: this.state.commentValue
    }
    this.setState({
      comments: [
        newComment,
        ...this.state.comments
      ],
      commentAuthor: '',
      commentValue: '',
      error: ''
    }, () => localStorage.setItem('comments', JSON.stringify(this.state.comments)) );

  }
  deleteHandler = itemId => {
    this.setState({
      comments: this.state.comments.filter(item => {
        if(item.id === itemId) return false;
        else return true;
      })
    }, () => localStorage.setItem('comments', JSON.stringify(this.state.comments)))
  }
  render() {
    return (
      <div className="App">
        <h1 className="App__Header">Комментарии</h1>
        <New
          commentAuthor={this.state.commentAuthor}
          onCommentAuthorChange={this.commentAuthorChangeHandler}
          newCommentValue={this.state.commentValue}
          onCommentValueChange={this.commentValueChangeHandler}
          onCommentCreate={this.commentCreateHandler}
        />
        {this.state.error &&
          <div className="App__Error">{this.state.error}</div>
        }
        <List
          comments={this.state.comments}
          onDelete={this.deleteHandler}
        />
      </div>
    )
  }
}

export default App;
