module.exports = function (plop) {
  // create your generators here
  plop.setGenerator('command', {
    description: 'Setup a new discord bot command',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the command name?'
      },
      {
        type: 'input',
        name: 'description',
        message: 'What is the description for the command?'
      },
      {
        type: 'input',
        name: 'alias',
        message: 'Is there an alias for this command?'
      },
      {
        type: 'confirm',
        name: 'guild',
        message: 'Is this a guild only command?'
      }
    ], // array of inquirer prompts
    actions: [{
      type: 'add',
      path: 'commands/{{kebabCase name}}.js',
      templateFile: 'plop-templates/command.hbs'
    }]  // array of actions
  });
};