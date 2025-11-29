import swaggerAutogen from 'swagger-autogen';

const outputFile = '../../swagger-output.json'; // generated at backend root
const endpointsFiles = ['../routes/user.route.js','../routes/todo.route.js']; // from utils/ folder to routes/

const doc = {
  info: { title: 'ToDoList API', description: 'API for ToDoList app' },
  host: 'localhost:3000',
  schemes: ['http'],
  tags: [
    { name: 'Users', description: 'User registration and login' },
    { name: 'Todos', description: 'Todos operations' }
  ],
};

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger JSON generated!');
});
