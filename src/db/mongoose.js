const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  }
});

// const me = new User({
//   name: 'Jin',
//   age: 29,
//   password: 'nohomo'
// });

// me.save()
//   .then(result => {
//     console.log(result);
//   })
//   .catch(error => {
//     console.log(error)
//   })

const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const newTask = new Task({
  description: 'learn backend dev',
});

newTask.save()
  .then(res => console.log(res))
  .catch(err => console.log(err))