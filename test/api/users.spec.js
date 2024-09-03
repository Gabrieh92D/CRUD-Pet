const request = require('supertest');
const baseUrl = 'https://petstore.swagger.io/v2';

const users = [
  { id: 1, username: 'joaosilva', firstName: 'João', lastName: 'Silva', email: 'joao.silva@iterasyus.com', password: 'senha123', phone: '11-98765-4321', userStatus: 1 },
  { id: 2, username: 'mariapereira', firstName: 'Maria', lastName: 'Pereira', email: 'maria.pereira@iterasyus.com', password: 'senha123', phone: '21-97654-3210', userStatus: 1 },
  { id: 3, username: 'carlosoliveira', firstName: 'Carlos', lastName: 'Oliveira', email: 'carlos.oliveira@iterasyus.com', password: 'senha123', phone: '31-96543-2109', userStatus: 1 }
];

describe('CRUD de Usuário', () => {
  it('deve criar um novo usuário', async () => {
    const response = await request(baseUrl)
      .post('/user')
      .send(users[0])
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('message', '1');
  });

  it('deve ler um usuário existente', async () => {
    const response = await request(baseUrl)
      .get(`/user/${users[0].username}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('id', users[0].id);
    expect(response.body).toHaveProperty('username', users[0].username);
    expect(response.body).toHaveProperty('firstName', users[0].firstName);
    expect(response.body).toHaveProperty('lastName', users[0].lastName);
    expect(response.body).toHaveProperty('email', users[0].email);
    expect(response.body).toHaveProperty('password', users[0].password);
    expect(response.body).toHaveProperty('phone', users[0].phone);
    expect(response.body).toHaveProperty('userStatus', users[0].userStatus);
  });

  it('deve atualizar um usuário existente', async () => {
    const updatedUser = { ...users[0], firstName: 'João Atualizado' };
    const response = await request(baseUrl)
      .put(`/user/${users[0].username}`)
      .send(updatedUser)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('message', '1');
  });

  it('deve excluir um usuário existente', async () => {
    await request(baseUrl)
      .delete(`/user/${users[0].username}`)
      .expect(200);

    await request(baseUrl)
      .get(`/user/${users[0].username}`)
      .expect(404);
  });

  it('deve criar e excluir múltiplos usuários', async () => {
    for (const user of users) {
      await request(baseUrl)
        .post('/user')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200);

      const getUserResponse = await request(baseUrl)
        .get(`/user/${user.username}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(getUserResponse.body).toHaveProperty('id', user.id);
      expect(getUserResponse.body).toHaveProperty('username', user.username);
      expect(getUserResponse.body).toHaveProperty('firstName', user.firstName);
      expect(getUserResponse.body).toHaveProperty('lastName', user.lastName);
      expect(getUserResponse.body).toHaveProperty('email', user.email);
      expect(getUserResponse.body).toHaveProperty('password', user.password);
      expect(getUserResponse.body).toHaveProperty('phone', user.phone);
      expect(getUserResponse.body).toHaveProperty('userStatus', user.userStatus);

      await request(baseUrl)
        .delete(`/user/${user.username}`)
        .expect(200);

      await request(baseUrl)
        .get(`/user/${user.username}`)
        .expect(404);
    }
  }, 10000);

  it('deve criar e excluir múltiplos usuários (data-driven)', async () => {
    for (const user of users) {
      const postResponse = await request(baseUrl)
        .post('/user')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(postResponse.body).toHaveProperty('code', 200);
      expect(postResponse.body).toHaveProperty('message', '2');

      const getUserResponse = await request(baseUrl)
        .get(`/user/${user.username}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(getUserResponse.body).toHaveProperty('id', user.id);
      expect(getUserResponse.body).toHaveProperty('username', user.username);
      expect(getUserResponse.body).toHaveProperty('firstName', user.firstName);
      expect(getUserResponse.body).toHaveProperty('lastName', user.lastName);
      expect(getUserResponse.body).toHaveProperty('email', user.email);
      expect(getUserResponse.body).toHaveProperty('password', user.password);
      expect(getUserResponse.body).toHaveProperty('phone', user.phone);
      expect(getUserResponse.body).toHaveProperty('userStatus', user.userStatus);

      await request(baseUrl)
        .delete(`/user/${user.username}`)
        .expect(200);

      await request(baseUrl)
        .get(`/user/${user.username}`)
        .expect(404);
    }
  }, 10000);
});
