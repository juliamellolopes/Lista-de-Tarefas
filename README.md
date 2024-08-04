# Aplicativo Lista de Tarefas

Esta aplicação permite que usuários se registrem, façam login e gerenciem suas tarefas. Os usuários podem criar, editar, concluir e excluir tarefas de maneira simples e eficiente. O frontend foi desenvolvido com React e estilizado com Tailwind CSS, enquanto o backend utiliza Node.js para criar uma API RESTful, com os dados armazenados em um banco de dados MongoDB.

## Compilação do Projeto

Para rodar o projeto, siga os passos abaixo:

1. Acesse a pasta do `server.js` e execute o seguinte comando:

    ```bash
    nodemon server.js
    ```

2. Em seguida, acesse a pasta `client` e execute o comando:

    ```bash
    npm start
    ```

## Funcionamento

Certifique-se de que sua máquina tem suporte para React e MongoDB. Após executar os comandos de compilação, a aplicação abrirá na página de login. Se ainda não tiver uma conta, redirecione-se para a página de registro. Após o registro, faça o login, e você será redirecionado para a página de Tasks, onde poderá criar, editar, excluir e concluir tarefas.
